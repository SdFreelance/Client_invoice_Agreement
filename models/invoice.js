const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  secureToken: { type: String, required: true, unique: true },
  projectName: {type: String, required: true},
  clientName: {type: String, required: true},
  clientEmail: {type: String, required: true},
  dueDate: String,
  billperiod: {type: String, required: true},
  advancepayment: {type: String, required: true},
  totalpayment: {type: String, required: true},
  pay: {type: String, required: true},
  paymentstatus: {type: String, required: true},
  services: [
    {
      name: {type: String, required: true},
      qty: {type: String, required: true},
      des:{type: String, required: true},
      amount: {type: String, required: true},
      totalamount: {type: String, required: true},
    }
  ],
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Invoice', InvoiceSchema);
