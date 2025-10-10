/**
 * Customer Health Portal - Add Business Form
 * GoDeskless Inc.
 */
"use client";

import React, { useState, useEffect } from "react";

import { format } from "date-fns";
import {
  Plus,
  Building2,
  Users,
  Calendar as CalendarIcon,
  Phone,
  Mail,
  CreditCard,
  Briefcase,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthService } from "@/services/auth-service";

interface CustomerSignupData {
  tenant_type: string;
  first_name: string;
  last_name: string;
  company_name: string;
  designation: string;
  instance_name: string;
  is_prospect: boolean;
  is_flexible: boolean;
  fr_allowed: string;
  fm_allowed: string;
  disp_allowed: string;
  total_licensed_users_allowed: string;
  start_date: string;
  end_date: string;
  country_code: string;
  phone_number: string;
  product_name: string;
  crm_type: string;
  email: string;
  about_audetemi: string;
  media_pack_allowed: string;
  sms_allowed: string;
  video_call_allowed: string;
  whatsapp_allowed: string;
  secondary_first_name: string;
  secondary_last_name: string;
  secondary_phone: string;
}

const crmOptions = ["Freshdesk", "Freshservice", "Service Now", "Salesforce", "CSS", "GoDeskless", "Zendesk"];

const countryCodeOptions = ["+91", "+972", "+93", "+564"];

export function AddBusinessForm() {
  const initialFormData: CustomerSignupData = {
    tenant_type: "paid",
    first_name: "",
    last_name: "",
    company_name: "",
    designation: "",
    instance_name: "",
    is_prospect: false,
    is_flexible: false,
    fr_allowed: "",
    fm_allowed: "",
    disp_allowed: "",
    total_licensed_users_allowed: "",
    start_date: "",
    end_date: "",
    country_code: "+91",
    phone_number: "",
    product_name: "GoDeskless",
    crm_type: "",
    email: "",
    about_audetemi: "Internet",
    media_pack_allowed: "0",
    sms_allowed: "",
    video_call_allowed: "",
    whatsapp_allowed: "",
    secondary_first_name: "",
    secondary_last_name: "",
    secondary_phone: "",
  };

  const [formData, setFormData] = useState<CustomerSignupData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Set minimum dates
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day for proper comparison
  const todayStr = today.toISOString().split("T")[0];
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const minEndDate = nextMonth.toISOString().split("T")[0];

  // Validation functions
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "first_name":
      case "last_name":
      case "designation":
        if (/\d/.test(value)) {
          return `${field.replace("_", " ")} cannot contain digits`;
        }
        break;
      case "fr_allowed":
      case "fm_allowed":
      case "disp_allowed":
      case "total_licensed_users_allowed":
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return "";
        if (numValue % 1 !== 0) return "Decimal digits are not allowed";
        if (numValue < 0) return "Number cannot be negative";
        if (numValue > 5000) return "Number cannot be more than 5000";
        break;
      case "sms_allowed":
      case "video_call_allowed":
      case "whatsapp_allowed":
        const mediaValue = parseFloat(value);
        if (isNaN(mediaValue)) return "";
        if (mediaValue < 0) return "Number cannot be negative";
        if (mediaValue > 20000) return "Number cannot be more than 20000";
        break;
    }
    return "";
  };

  const handleInputChange = (field: string, value: string) => {
    // Validate the field
    const error = validateField(field, value);

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [field]: field === "is_prospect" ? value === "true" : value,
    }));

    // Handle tenant_type based on prospect status
    if (field === "is_prospect") {
      setFormData((prev) => ({
        ...prev,
        is_prospect: value === "true",
        tenant_type: value === "true" ? "default" : "paid",
      }));
    }

    // Special handling for start date to update minimum end date
    if (field === "start_date" && value) {
      // Reset end date if it's before or equal to the new start date
      if (formData.end_date && formData.end_date <= value) {
        setFormData((prev) => ({
          ...prev,
          end_date: "",
        }));
      }
    }
  };

  // License sum validation
  const validateLicenseSum = (): boolean => {
    const total = parseInt(formData.total_licensed_users_allowed) || 0;
    const agents = parseInt(formData.fr_allowed) || 0;
    const managers = parseInt(formData.fm_allowed) || 0;
    const dispatchers = parseInt(formData.disp_allowed) || 0;

    const sum = agents + managers + dispatchers;

    if (sum > total && total > 0) {
      toast.error("The sum of Field Agents, Field Managers, and Dispatchers cannot exceed Total Licenses");
      return false;
    }
    return true;
  };

  const isFormValid = (): boolean => {
    return (
      formData.first_name !== "" &&
      formData.last_name !== "" &&
      formData.company_name !== "" &&
      formData.instance_name !== "" &&
      formData.fr_allowed !== "" &&
      formData.fm_allowed !== "" &&
      formData.disp_allowed !== "" &&
      formData.total_licensed_users_allowed !== "" &&
      formData.start_date !== "" &&
      formData.end_date !== "" &&
      formData.phone_number !== "" &&
      formData.crm_type !== "" &&
      formData.email !== "" &&
      Object.values(errors).every((error) => !error)
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    // Validate license sum
    if (!validateLicenseSum()) {
      setLoading(false);
      return;
    }

    // Check if user is authenticated
    if (!AuthService.isAuthenticated()) {
      toast.error("Authentication required. Please log in again.");
      AuthService.logout();
      setLoading(false);
      return;
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      tenant_type: formData.is_prospect ? "default" : "paid",
      media_pack_allowed: "0",
    };

    try {
      const response = await fetch("https://multitenancydev.godeskless.com/api/generic/new-customer-signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...AuthService.getAuthHeader(),
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (response.status === 401) {
        toast.error("Session expired. Please log in again.");
        AuthService.logout();
        return;
      }

      if (response.ok && result.success) {
        toast.success(result.msg || "Business created successfully");

        // Reset form
        setFormData(initialFormData);
        setErrors({});
      } else {
        throw new Error(result.msg || "Failed to create business");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create business");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Tabs
        value={formData.is_prospect ? "prospect" : "customer"}
        onValueChange={(value) => handleInputChange("is_prospect", value === "prospect" ? "true" : "false")}
      >
        {/* Tab Headers */}
        <div className="mb-6 flex items-center justify-center">
          <TabsList className="cursor-pointer">
            <TabsTrigger value="customer" className="cursor-pointer">
              Customer
            </TabsTrigger>
            <TabsTrigger value="prospect" className="cursor-pointer">
              Prospect
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="customer" className="space-y-6">
          <FormContent
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            crmOptions={crmOptions}
            countryCodeOptions={countryCodeOptions}
            today={todayStr}
            minEndDate={minEndDate}
          />
          <FormActions
            onSubmit={handleSubmit}
            loading={loading}
            isFormValid={isFormValid}
            buttonText="Create Customer"
          />
        </TabsContent>

        <TabsContent value="prospect" className="space-y-6">
          <FormContent
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            crmOptions={crmOptions}
            countryCodeOptions={countryCodeOptions}
            today={todayStr}
            minEndDate={minEndDate}
          />
          <FormActions
            onSubmit={handleSubmit}
            loading={loading}
            isFormValid={isFormValid}
            buttonText="Create Prospect"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface FormContentProps {
  formData: CustomerSignupData;
  errors: Record<string, string>;
  handleInputChange: (field: string, value: string) => void;
  crmOptions: string[];
  countryCodeOptions: string[];
  today: string;
  minEndDate: string;
}

function FormContent({
  formData,
  errors,
  handleInputChange,
  crmOptions,
  countryCodeOptions,
  today,
  minEndDate,
}: FormContentProps) {
  // Create Date objects for calendar comparisons - use current date to avoid timezone issues
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-6">
      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name *</Label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) => handleInputChange("company_name", e.target.value)}
              placeholder="Enter company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instance_name">Instance Name *</Label>
            <Input
              id="instance_name"
              value={formData.instance_name}
              onChange={(e) => handleInputChange("instance_name", e.target.value)}
              placeholder="Enter instance name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="crm_type">CRM Type *</Label>
            <Select value={formData.crm_type} onValueChange={(value) => handleInputChange("crm_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select CRM type" />
              </SelectTrigger>
              <SelectContent>
                {crmOptions.map((crm) => (
                  <SelectItem key={crm} value={crm}>
                    {crm}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Primary Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Primary Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
              placeholder="Enter first name"
            />
            {errors.first_name && <p className="text-destructive text-sm">{errors.first_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
              placeholder="Enter last name"
            />
            {errors.last_name && <p className="text-destructive text-sm">{errors.last_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation">Designation *</Label>
            <Input
              id="designation"
              value={formData.designation}
              onChange={(e) => handleInputChange("designation", e.target.value)}
              placeholder="Enter designation"
            />
            {errors.designation && <p className="text-destructive text-sm">{errors.designation}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country_code">Country Code *</Label>
            <Select value={formData.country_code} onValueChange={(value) => handleInputChange("country_code", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countryCodeOptions.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number *</Label>
            <Input
              id="phone_number"
              value={formData.phone_number}
              onChange={(e) => handleInputChange("phone_number", e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
        </CardContent>
      </Card>

      {/* Licensed Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Licensed Users
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="total_licensed_users_allowed">Total Licenses *</Label>
            <Input
              id="total_licensed_users_allowed"
              type="number"
              value={formData.total_licensed_users_allowed}
              onChange={(e) => handleInputChange("total_licensed_users_allowed", e.target.value)}
              placeholder="Enter total licenses"
              min="0"
              max="5000"
            />
            {errors.total_licensed_users_allowed && (
              <p className="text-destructive text-sm">{errors.total_licensed_users_allowed}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fr_allowed">Field Agents *</Label>
            <Input
              id="fr_allowed"
              type="number"
              value={formData.fr_allowed}
              onChange={(e) => handleInputChange("fr_allowed", e.target.value)}
              placeholder="Enter field agents"
              min="0"
              max="5000"
            />
            {errors.fr_allowed && <p className="text-destructive text-sm">{errors.fr_allowed}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fm_allowed">Field Managers *</Label>
            <Input
              id="fm_allowed"
              type="number"
              value={formData.fm_allowed}
              onChange={(e) => handleInputChange("fm_allowed", e.target.value)}
              placeholder="Enter field managers"
              min="0"
              max="5000"
            />
            {errors.fm_allowed && <p className="text-destructive text-sm">{errors.fm_allowed}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="disp_allowed">Dispatchers *</Label>
            <Input
              id="disp_allowed"
              type="number"
              value={formData.disp_allowed}
              onChange={(e) => handleInputChange("disp_allowed", e.target.value)}
              placeholder="Enter dispatchers"
              min="0"
              max="5000"
            />
            {errors.disp_allowed && <p className="text-destructive text-sm">{errors.disp_allowed}</p>}
          </div>
        </CardContent>
      </Card>

      {/* License Period */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            License Period
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Licensed Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${!formData.start_date ? "text-muted-foreground" : ""}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.start_date ? format(new Date(formData.start_date), "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.start_date ? new Date(formData.start_date) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      handleInputChange("start_date", format(date, "yyyy-MM-dd"));
                    }
                  }}
                  disabled={(date) => {
                    const compareDate = new Date(date);
                    compareDate.setHours(0, 0, 0, 0);
                    return compareDate < todayDate;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Renewal Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${!formData.end_date ? "text-muted-foreground" : ""}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.end_date ? format(new Date(formData.end_date), "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.end_date ? new Date(formData.end_date) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      handleInputChange("end_date", format(date, "yyyy-MM-dd"));
                    }
                  }}
                  disabled={(date) => {
                    const compareDate = new Date(date);
                    compareDate.setHours(0, 0, 0, 0);

                    if (formData.start_date) {
                      const startDate = new Date(formData.start_date);
                      startDate.setHours(0, 0, 0, 0);
                      // Allow any date after the start date (not necessarily a month later)
                      return compareDate <= startDate;
                    }

                    // If no start date selected, don't allow dates before today
                    return compareDate < todayDate;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Media Packs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Media Packs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="sms_allowed">SMS / Month</Label>
              <Input
                id="sms_allowed"
                type="number"
                value={formData.sms_allowed}
                onChange={(e) => handleInputChange("sms_allowed", e.target.value)}
                placeholder="SMS count"
                min="0"
                max="20000"
              />
              {errors.sms_allowed && <p className="text-destructive text-sm">{errors.sms_allowed}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="video_call_allowed">Video Minutes / Month</Label>
              <Input
                id="video_call_allowed"
                type="number"
                value={formData.video_call_allowed}
                onChange={(e) => handleInputChange("video_call_allowed", e.target.value)}
                placeholder="Video minutes"
                min="0"
                max="20000"
              />
              {errors.video_call_allowed && <p className="text-destructive text-sm">{errors.video_call_allowed}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp_allowed">WhatsApp / Month</Label>
              <Input
                id="whatsapp_allowed"
                type="number"
                value={formData.whatsapp_allowed}
                onChange={(e) => handleInputChange("whatsapp_allowed", e.target.value)}
                placeholder="WhatsApp count"
                min="0"
                max="20000"
              />
              {errors.whatsapp_allowed && <p className="text-destructive text-sm">{errors.whatsapp_allowed}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Secondary Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="secondary_first_name">First Name</Label>
            <Input
              id="secondary_first_name"
              value={formData.secondary_first_name}
              onChange={(e) => handleInputChange("secondary_first_name", e.target.value)}
              placeholder="Enter first name (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary_last_name">Last Name</Label>
            <Input
              id="secondary_last_name"
              value={formData.secondary_last_name}
              onChange={(e) => handleInputChange("secondary_last_name", e.target.value)}
              placeholder="Enter last name (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary_phone">Phone Number</Label>
            <Input
              id="secondary_phone"
              value={formData.secondary_phone}
              onChange={(e) => handleInputChange("secondary_phone", e.target.value)}
              placeholder="Enter phone number (optional)"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface FormActionsProps {
  onSubmit: () => void;
  loading: boolean;
  isFormValid: () => boolean;
  buttonText: string;
}

function FormActions({ onSubmit, loading, isFormValid, buttonText }: FormActionsProps) {
  return (
    <div className="flex justify-between gap-4">
      <Button
        variant="outline"
        onClick={() => window.history.back()}
        disabled={loading}
        className="border-red-300 text-red-500 hover:bg-red-50 hover:text-red-500"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Cancel
      </Button>
      <Button onClick={onSubmit} disabled={!isFormValid() || loading}>
        <Briefcase className="mr-2 h-4 w-4" />
        {loading ? "Creating..." : buttonText}
      </Button>
    </div>
  );
}
