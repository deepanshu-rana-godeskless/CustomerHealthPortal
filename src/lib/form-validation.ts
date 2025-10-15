/**
 * Form Validation Utilities
 * Provides type-safe form validation with comprehensive error handling
 * Follows SOLID principles with reusable validation rules
 */

import { useMemo, useCallback } from "react";
import { FormState, ValidationError, FormFieldValidation } from "@/types/common";

/**
 * Common validation rules
 */
export const ValidationRules = {
    required: (message = 'This field is required') => (value: any): string | null => {
        if (value === null || value === undefined || value === '') {
            return message;
        }
        return null;
    },

    email: (message = 'Please enter a valid email address') => (value: string): string | null => {
        if (!value) return null; // Allow empty for non-required fields
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : message;
    },

    minLength: (min: number, message?: string) => (value: string): string | null => {
        if (!value) return null;
        const defaultMessage = `Must be at least ${min} characters long`;
        return value.length >= min ? null : (message || defaultMessage);
    },

    maxLength: (max: number, message?: string) => (value: string): string | null => {
        if (!value) return null;
        const defaultMessage = `Must be no more than ${max} characters long`;
        return value.length <= max ? null : (message || defaultMessage);
    },

    pattern: (regex: RegExp, message = 'Invalid format') => (value: string): string | null => {
        if (!value) return null;
        return regex.test(value) ? null : message;
    },

    numeric: (message = 'Must be a valid number') => (value: string): string | null => {
        if (!value) return null;
        return !isNaN(Number(value)) ? null : message;
    },

    phone: (message = 'Please enter a valid phone number') => (value: string): string | null => {
        if (!value) return null;
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(value.replace(/\s+/g, '')) ? null : message;
    },

    url: (message = 'Please enter a valid URL') => (value: string): string | null => {
        if (!value) return null;
        try {
            new URL(value);
            return null;
        } catch {
            return message;
        }
    },

    date: (message = 'Please enter a valid date') => (value: string): string | null => {
        if (!value) return null;
        const date = new Date(value);
        return !isNaN(date.getTime()) ? null : message;
    },

    custom: <T>(validator: (value: T) => boolean, message: string) => (value: T): string | null => {
        return validator(value) ? null : message;
    },
} as const;

/**
 * Validation rule type
 */
export type ValidationRule<T = any> = (value: T) => string | null;

/**
 * Form field configuration
 */
export interface FormFieldConfig<T = any> {
    initialValue: T;
    rules?: ValidationRule<T>[];
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
}

/**
 * Form configuration
 */
export interface FormConfig<T extends Record<string, any>> {
    fields: {
        [K in keyof T]: FormFieldConfig<T[K]>;
    };
    validateOnSubmit?: boolean;
    resetOnSubmit?: boolean;
}

/**
 * Enhanced form validation hook
 */
export function useFormValidation<T extends Record<string, any>>(config: FormConfig<T>) {
    const initialValues = useMemo(() => {
        const values = {} as T;
        Object.keys(config.fields).forEach((key) => {
            const fieldKey = key as keyof T;
            values[fieldKey] = config.fields[fieldKey].initialValue;
        });
        return values;
    }, [config.fields]);

    const [formState, setFormState] = React.useState<FormState<T>>({
        values: initialValues,
        errors: {},
        touched: {},
        isSubmitting: false,
        isValid: true,
        isDirty: false,
    });

    /**
     * Validate a single field
     */
    const validateField = useCallback((
        fieldName: keyof T,
        value: T[keyof T]
    ): ValidationError | null => {
        const fieldConfig = config.fields[fieldName];
        if (!fieldConfig?.rules) return null;

        for (const rule of fieldConfig.rules) {
            const error = rule(value);
            if (error) {
                return {
                    field: fieldName as string,
                    message: error,
                    code: 'VALIDATION_ERROR',
                };
            }
        }

        return null;
    }, [config.fields]);

    /**
     * Validate all fields
     */
    const validateForm = useCallback((): Record<string, ValidationError> => {
        const errors: Record<string, ValidationError> = {};

        Object.keys(config.fields).forEach((key) => {
            const fieldKey = key as keyof T;
            const error = validateField(fieldKey, formState.values[fieldKey]);
            if (error) {
                errors[key] = error;
            }
        });

        return errors;
    }, [config.fields, formState.values, validateField]);

    /**
     * Update field value
     */
    const setFieldValue = useCallback((
        fieldName: keyof T,
        value: T[keyof T],
        shouldValidate = false
    ) => {
        setFormState(prev => {
            const newErrors = { ...prev.errors };

            if (shouldValidate) {
                const error = validateField(fieldName, value);
                if (error) {
                    newErrors[fieldName as string] = error;
                } else {
                    delete newErrors[fieldName as string];
                }
            }

            const newValues = { ...prev.values, [fieldName]: value };
            const isDirty = JSON.stringify(newValues) !== JSON.stringify(initialValues);

            return {
                ...prev,
                values: newValues,
                errors: newErrors,
                touched: { ...prev.touched, [fieldName]: true },
                isDirty,
                isValid: Object.keys(newErrors).length === 0,
            };
        });
    }, [validateField, initialValues]);

    /**
     * Handle field change
     */
    const handleChange = useCallback((fieldName: keyof T) => (
        value: T[keyof T]
    ) => {
        const fieldConfig = config.fields[fieldName];
        const shouldValidate = fieldConfig?.validateOnChange ?? false;
        setFieldValue(fieldName, value, shouldValidate);
    }, [config.fields, setFieldValue]);

    /**
     * Handle field blur
     */
    const handleBlur = useCallback((fieldName: keyof T) => () => {
        const fieldConfig = config.fields[fieldName];
        if (fieldConfig?.validateOnBlur ?? true) {
            const error = validateField(fieldName, formState.values[fieldName]);
            setFormState(prev => ({
                ...prev,
                errors: error
                    ? { ...prev.errors, [fieldName]: error }
                    : { ...prev.errors, [fieldName]: undefined },
                touched: { ...prev.touched, [fieldName]: true },
            }));
        }
    }, [config.fields, validateField, formState.values]);

    /**
     * Submit form
     */
    const handleSubmit = useCallback(async (
        onSubmit: (values: T) => Promise<void> | void
    ) => {
        setFormState(prev => ({ ...prev, isSubmitting: true }));

        try {
            if (config.validateOnSubmit ?? true) {
                const errors = validateForm();
                if (Object.keys(errors).length > 0) {
                    setFormState(prev => ({
                        ...prev,
                        errors,
                        isSubmitting: false,
                        isValid: false,
                    }));
                    return;
                }
            }

            await onSubmit(formState.values);

            if (config.resetOnSubmit) {
                setFormState({
                    values: initialValues,
                    errors: {},
                    touched: {},
                    isSubmitting: false,
                    isValid: true,
                    isDirty: false,
                });
            } else {
                setFormState(prev => ({ ...prev, isSubmitting: false }));
            }
        } catch (error) {
            setFormState(prev => ({ ...prev, isSubmitting: false }));
            throw error;
        }
    }, [config.validateOnSubmit, config.resetOnSubmit, validateForm, formState.values, initialValues]);

    /**
     * Reset form
     */
    const reset = useCallback(() => {
        setFormState({
            values: initialValues,
            errors: {},
            touched: {},
            isSubmitting: false,
            isValid: true,
            isDirty: false,
        });
    }, [initialValues]);

    /**
     * Set form errors (useful for server-side validation)
     */
    const setErrors = useCallback((errors: Record<string, ValidationError>) => {
        setFormState(prev => ({
            ...prev,
            errors,
            isValid: Object.keys(errors).length === 0,
        }));
    }, []);

    return {
        values: formState.values,
        errors: formState.errors,
        touched: formState.touched,
        isSubmitting: formState.isSubmitting,
        isValid: formState.isValid,
        isDirty: formState.isDirty,
        setFieldValue,
        handleChange,
        handleBlur,
        handleSubmit,
        validateField,
        validateForm,
        reset,
        setErrors,
    };
}

/**
 * Common form configurations
 */
export const CommonFormConfigs = {
    /**
     * Customer form configuration
     */
    customer: {
        fields: {
            name: {
                initialValue: '',
                rules: [
                    ValidationRules.required('Customer name is required'),
                    ValidationRules.minLength(2, 'Name must be at least 2 characters'),
                    ValidationRules.maxLength(100, 'Name must be less than 100 characters'),
                ],
                validateOnChange: true,
            },
            email: {
                initialValue: '',
                rules: [
                    ValidationRules.required('Email is required'),
                    ValidationRules.email(),
                ],
                validateOnChange: true,
            },
            phone: {
                initialValue: '',
                rules: [ValidationRules.phone()],
                validateOnBlur: true,
            },
            company: {
                initialValue: '',
                rules: [ValidationRules.maxLength(100)],
            },
        },
        validateOnSubmit: true,
    } as FormConfig<{
        name: string;
        email: string;
        phone: string;
        company: string;
    }>,

    /**
     * Business form configuration
     */
    business: {
        fields: {
            name: {
                initialValue: '',
                rules: [
                    ValidationRules.required('Business name is required'),
                    ValidationRules.minLength(2),
                    ValidationRules.maxLength(100),
                ],
            },
            website: {
                initialValue: '',
                rules: [ValidationRules.url()],
            },
            description: {
                initialValue: '',
                rules: [ValidationRules.maxLength(500)],
            },
        },
        validateOnSubmit: true,
    } as FormConfig<{
        name: string;
        website: string;
        description: string;
    }>,
} as const;

/**
 * React import for useState (assuming it's available)
 * In a real implementation, this would be at the top of the file
 */
declare const React: {
    useState: <T>(initialValue: T) => [T, (value: T | ((prev: T) => T)) => void];
};