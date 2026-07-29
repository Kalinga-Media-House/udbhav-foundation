import * as crypto from 'crypto';

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

import { uploadFile } from '@/lib/storage/upload';

import { TaxReceiptRepository } from './repository';

export interface DonationDetails {
  id: string; // The donation_id
  donorName: string;
  amount: number;
  currency: string;
  date: Date;
  receiptNumber: string;
}

export const PDFService = {
  async generateAndStoreReceipt(details: DonationDetails): Promise<string> {
    // 1. Generate PDF in memory
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    
    const page = pdfDoc.addPage();
    const { height } = page.getSize();
    const fontSize = 16;
    
    page.drawText(`Tax Receipt: ${details.receiptNumber}`, {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Donor: ${details.donorName}`, {
      x: 50,
      y: height - 6 * fontSize,
      size: 14,
      font: timesRomanFont,
    });
    
    page.drawText(`Amount: ${details.amount} ${details.currency}`, {
      x: 50,
      y: height - 8 * fontSize,
      size: 14,
      font: timesRomanFont,
    });

    page.drawText(`Date: ${details.date.toLocaleDateString()}`, {
      x: 50,
      y: height - 10 * fontSize,
      size: 14,
      font: timesRomanFont,
    });

    page.drawText(`Thank you for your generous donation to UDBHAV Foundation!`, {
      x: 50,
      y: height - 14 * fontSize,
      size: 14,
      font: timesRomanFont,
    });

    const pdfBytes = await pdfDoc.save();

    // 2. Upload to Cloudflare R2
    const fileName = `receipts/${details.receiptNumber}_${crypto.randomUUID()}.pdf`;
    
    const fileBuffer = Buffer.from(pdfBytes);
    const uploadResult = await uploadFile(fileBuffer, fileName, {
      bucket: 'media',
      contentType: 'application/pdf'
    });

    if (uploadResult.error || !uploadResult.data) {
      throw new Error(`Failed to upload PDF: ${uploadResult.error?.message}`);
    }
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const isNextYear = now.getMonth() >= 3; // April or later
    const financialYear = isNextYear ? `${currentYear}-${currentYear + 1}` : `${currentYear - 1}-${currentYear}`;

    // 3. Store metadata in DB
    const receipt = await TaxReceiptRepository.createReceipt({
      donation_id: details.id,
      receipt_number: details.receiptNumber,
      r2_url: uploadResult.data.url,
      financial_year: financialYear,
      checksum: 'TBD', // In a real app we can calculate a sha256 hash here
    });

    return receipt.r2_url as string;
  }
};
