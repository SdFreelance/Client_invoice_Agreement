const mongoose = require('mongoose');

const AgreementSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String },
  totalAmount: { type: Number, required: true },
  agreementText: { type: String },
  signature: { type: String }, // text or base64
  createdAt: { type: Date, default: Date.now },

  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },

  clientFolder: { type: String, required: true }
});

// Prevent duplicate agreements per user/project
AgreementSchema.index({ user: 1, projectName: 1 }, { unique: true });

module.exports = mongoose.model('Agreement', AgreementSchema);
