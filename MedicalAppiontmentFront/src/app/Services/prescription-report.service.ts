import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Prescription, PrescriptionDetail } from './prescription.service';

export interface PrescriptionReportData {
  prescription: Prescription;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  visitType: string;
  prescriptionDate: string;
  generalNotes?: string;
  followUpInstructions?: string;
  prescriptionDetails: PrescriptionDetail[];
}

@Injectable({
  providedIn: 'root'
})
export class PrescriptionReportService {

  constructor() { }

  generatePrescriptionReport(data: PrescriptionReportData): void {
    const doc = new jsPDF();
    
    // Set up the document
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Prescription Report', 105, 30, { align: 'center' });
    
    // Add download instruction
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Download the PDF format below', 105, 45, { align: 'center' });
    
    // Patient and Visit Information
    let yPosition = 70;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Information:', 20, yPosition);
    
    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`Patient: ${data.patientName}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Doctor: ${data.doctorName}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Date: ${this.formatDate(data.appointmentDate)}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Visit Type: ${data.visitType}`, 20, yPosition);
    
    // Prescriptions Section
    yPosition += 15;
    doc.setFont('helvetica', 'bold');
    doc.text('Prescriptions', 20, yPosition);
    
    // Create prescription table
    yPosition += 10;
    this.createPrescriptionTable(doc, data.prescriptionDetails, yPosition);
    
    // Add general notes if available
    if (data.generalNotes) {
      yPosition += 60;
      doc.setFont('helvetica', 'bold');
      doc.text('General Notes:', 20, yPosition);
      yPosition += 8;
      doc.setFont('helvetica', 'normal');
      const notes = doc.splitTextToSize(data.generalNotes, 170);
      doc.text(notes, 20, yPosition);
    }
    
    // Add follow-up instructions if available
    if (data.followUpInstructions) {
      yPosition += 30;
      doc.setFont('helvetica', 'bold');
      doc.text('Follow-up Instructions:', 20, yPosition);
      yPosition += 8;
      doc.setFont('helvetica', 'normal');
      const instructions = doc.splitTextToSize(data.followUpInstructions, 170);
      doc.text(instructions, 20, yPosition);
    }
    
    // Add doctor signature area
    yPosition += 40;
    doc.setFont('helvetica', 'normal');
    doc.text('Doctor\'s Signature: _________________', 20, yPosition);
    yPosition += 8;
    doc.text(`Date: ${this.formatDate(new Date().toISOString())}`, 20, yPosition);
    
    // Save the PDF
    const fileName = `Prescription_${data.patientName.replace(/\s+/g, '_')}_${this.formatDate(data.prescriptionDate)}.pdf`;
    doc.save(fileName);
  }

  private createPrescriptionTable(doc: jsPDF, prescriptionDetails: PrescriptionDetail[], startY: number): void {
    const tableTop = startY;
    const tableLeft = 20;
    const colWidths = [60, 50, 30, 30];
    const rowHeight = 8;
    
    // Table headers
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    
    const headers = ['Medicine', 'Dosage', 'Start Date', 'End Date'];
    let x = tableLeft;
    
    headers.forEach((header, index) => {
      doc.text(header, x, tableTop);
      x += colWidths[index];
    });
    
    // Draw header line
    doc.line(tableLeft, tableTop + 2, tableLeft + colWidths.reduce((a, b) => a + b, 0), tableTop + 2);
    
    // Table data
    doc.setFont('helvetica', 'normal');
    let currentY = tableTop + 10;
    
    prescriptionDetails.forEach((detail, index) => {
      if (currentY > 250) { // Check if we need a new page
        doc.addPage();
        currentY = 20;
      }
      
      x = tableLeft;
      const medicineName = detail.medicineName || 'N/A';
      const dosage = detail.dosage || 'N/A';
      const startDate = this.formatDate(detail.startDate);
      const endDate = this.formatDate(detail.endDate);
      
      const rowData = [medicineName, dosage, startDate, endDate];
      
      rowData.forEach((cell, cellIndex) => {
        const cellText = doc.splitTextToSize(cell, colWidths[cellIndex] - 2);
        doc.text(cellText, x + 1, currentY);
        x += colWidths[cellIndex];
      });
      
      currentY += rowHeight;
    });
  }

  private formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  generatePrescriptionReportFromPrescription(prescription: Prescription): void {
    const reportData: PrescriptionReportData = {
      prescription: prescription,
      patientName: prescription.patientName || 'Unknown Patient',
      doctorName: prescription.doctorName || 'Unknown Doctor',
      appointmentDate: prescription.appointmentDate || prescription.prescriptionDate,
      visitType: prescription.visitType || 'Regular',
      prescriptionDate: prescription.prescriptionDate,
      generalNotes: prescription.generalNotes,
      followUpInstructions: prescription.followUpInstructions,
      prescriptionDetails: prescription.prescriptionDetails || []
    };
    
    this.generatePrescriptionReport(reportData);
  }
}
