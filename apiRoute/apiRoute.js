const express = require("express");
const { createInvoice, updateInvoice, sendInvoice, getInvoiceByQuery } = require("../api/api");

const Route = express.Router();

Route.post("/createInvoice", createInvoice);
Route.post("/updateInvoice/:invoiceNumber", updateInvoice);
Route.post("/searchInvoiceByQuery", getInvoiceByQuery);
Route.post("/sendmail/:invoiceNumber", sendInvoice);


module.exports = Route;