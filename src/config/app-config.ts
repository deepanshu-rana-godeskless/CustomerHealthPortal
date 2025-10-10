import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Customer Health Portal",
  company: "GoDeskless Inc.",
  version: packageJson.version,
  copyright: `© ${currentYear}, GoDeskless Inc. All rights reserved.`,
  meta: {
    title: "Customer Health Portal - GoDeskless Inc.",
    description:
      "Comprehensive customer management and analytics platform for GoDeskless Inc. Monitor customer health, track engagement, and manage relationships with advanced analytics and insights.",
  },
  contact: {
    email: "support@godeskless.com",
    phone: "+1 (555) 123-4567",
    website: "https://godeskless.com",
  },
};
