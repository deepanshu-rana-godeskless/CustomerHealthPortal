/**
 * Customer Health Portal - Export Utilities
 * GoDeskless Inc.
 *
 * Utilities for exporting data to various formats
 */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import { formatDate } from "@/lib/date-utils";
import { getHealthScoreStyling, getPaymentDateStyling } from "@/lib/health-score-utils";
import type { Customer } from "@/types/customers";

// jspdf-autotable extends jsPDF automatically when imported

export type ExportFormat = "xlsx" | "csv" | "pdf";

/**
 * Get export data in standardized format
 */
function getExportData(customers: Customer[]) {
  return customers.map((customer) => {
    const healthStyling = getHealthScoreStyling(customer.company_score);
    const paymentStyling = getPaymentDateStyling(customer.paid_until);

    return {
      Company: customer.company,
      Subdomain: `${customer.subdomain}.godeskless.com`,
      Contact: `${customer.first_name} ${customer.last_name}`,
      Email: customer.business_email,
      Phone: customer.phone_number || "N/A",
      "Health Score": customer.company_score || "N/A",
      "Health Status": healthStyling.label,
      Users: `${customer.total_activated_users}/${customer.allowed_users}`,
      CRM: customer.crm_type,
      "Paid Until": formatDate(customer.paid_until),
      "Payment Status": paymentStyling.label,
    };
  });
}

/**
 * Export customers data to Excel file
 */
export function exportCustomersToExcel(customers: Customer[], filename?: string) {
  const exportData = getExportData(customers);

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths for better readability
  const colWidths = [
    { wch: 20 }, // Company
    { wch: 30 }, // Subdomain
    { wch: 25 }, // Contact
    { wch: 30 }, // Email
    { wch: 15 }, // Phone
    { wch: 12 }, // Health Score
    { wch: 15 }, // Users
    { wch: 15 }, // CRM
    { wch: 12 }, // Paid Until
  ];
  worksheet["!cols"] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

  // Generate filename with current date
  const defaultFilename = `customers-export-${new Date().toISOString().split("T")[0]}.xlsx`;
  const exportFilename = filename || defaultFilename;

  // Download the file
  XLSX.writeFile(workbook, exportFilename);
}

/**
 * Export customers data to CSV file
 */
export function exportCustomersToCSV(customers: Customer[], filename?: string) {
  const exportData = getExportData(customers);

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

  // Generate filename with current date
  const defaultFilename = `customers-export-${new Date().toISOString().split("T")[0]}.csv`;
  const exportFilename = filename || defaultFilename;

  // Download as CSV
  XLSX.writeFile(workbook, exportFilename, { bookType: "csv" });
}

/**
 * Export customers data to PDF file
 */
export function exportCustomersToPDF(customers: Customer[], filename?: string, title: string = "Customers Report") {
  const exportData = getExportData(customers);

  if (exportData.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Create new PDF document
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text(title, 20, 20);

  // Add generation date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

  // Prepare table data
  const tableHeaders = Object.keys(exportData[0]);
  const tableData = exportData.map((row) => Object.values(row));

  try {
    // Add table using autoTable
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 40,
      theme: "grid",
      headStyles: {
        fillColor: [59, 130, 246], // Blue header
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: "linebreak",
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Company
        1: { cellWidth: 35 }, // Subdomain
        2: { cellWidth: 25 }, // Contact
        3: { cellWidth: 30 }, // Email
        4: { cellWidth: 20 }, // Phone
        5: { cellWidth: 15 }, // Health Score
        6: { cellWidth: 15 }, // Users
        7: { cellWidth: 15 }, // CRM
        8: { cellWidth: 20 }, // Paid Until
      },
      margin: { top: 50 },
    });

    // Generate filename with current date
    const defaultFilename = `customers-export-${new Date().toISOString().split("T")[0]}.pdf`;
    const exportFilename = filename || defaultFilename;

    // Save the PDF
    doc.save(exportFilename);
  } catch (error) {
    console.error("Error creating PDF:", error);
    throw new Error("Failed to generate PDF export");
  }
}

/**
 * Main export function that handles all formats
 */
export function exportCustomers(customers: Customer[], format: ExportFormat, filename?: string, title?: string) {
  switch (format) {
    case "xlsx":
      return exportCustomersToExcel(customers, filename);
    case "csv":
      return exportCustomersToCSV(customers, filename);
    case "pdf":
      return exportCustomersToPDF(customers, filename, title);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}
