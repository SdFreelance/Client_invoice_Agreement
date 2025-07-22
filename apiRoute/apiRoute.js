const express = require("express");
const { createInvoice, updateInvoice, getInvoiceByNumber, downloadInvoice, sendInvoice, getInvoiceByName, getInvoiceByQuery } = require("../api/api");

const Route = express.Router();

Route.post("/createInvoice", createInvoice);
Route.post("/updateInvoice/:invoiceNumber", updateInvoice);
Route.post("/searchInvoiceByQuery", getInvoiceByQuery);
Route.post("/sendmail/:invoiceNumber", sendInvoice);
Route.get("/invoice/:secureToken", downloadInvoice);

module.exports = Route;