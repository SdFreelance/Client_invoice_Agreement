const invoice = require("../models/invoice");
async function generateInvoiceNumber() {
  const year = new Date().getFullYear();

  // Find the last invoice for current year
  const lastInvoice = await invoice.findOne({ invoiceNumber: new RegExp(`^INV-${year}`) }).sort({ createdAt: -1 });

  let sequence = 1;

  if (lastInvoice) {
    const parts = lastInvoice.invoiceNumber.split("-");
    sequence = parseInt(parts[2]) + 1;
  }

  const paddedSequence = String(sequence).padStart(3, '0');
  return `INV-${year}-${paddedSequence}`;
}

module.exports = generateInvoiceNumber