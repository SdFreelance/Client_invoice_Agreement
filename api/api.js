const Invoice = require("../models/invoice");
const generateInvoiceNumber = require("../middleware/generateInvoiceNumber");
// const clientnameformate = require("../middleware/client_name");
// const Agreement = require("../models/agreement");
const sendMail = require("../smtp/Smtp");
const numberToWords = require("../middleware/amtTowords");
const crypto = require("crypto");
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

//=======================================================================Invoice===============================================================================//
//=====InvoiceSlip=====//
const createInvoice = async (req, res) => {
  try {
    const {
      projectName,
      clientName,
      clientEmail,
      dueDate,
      billperiod,
      advancepayment,
      totalpayment,
      services,
      type,
      pay,
      paymentstatus,
    } = req.body;

    const invoiceNumber = await generateInvoiceNumber();
    const secureToken = crypto.randomBytes(60).toString("hex");

    await Invoice.create({
      invoiceNumber,
      secureToken,
      projectName,
      clientName,
      clientEmail,
      dueDate,
      billperiod,
      advancepayment,
      totalpayment,
      type,
      services,
      pay,
      paymentstatus,
    });
    // console.log(newInvoice);

    res
      .status(201)
      .json({ success: true, statuscode: 200, message: "invoice saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false,status_code: 500, message: "Failed to create invoice" });
  }
};

//=====Send Invoice=====//
const sendInvoice = async (req, res) => {
  try {
    const invoiceNumber = req.params.invoiceNumber;
    const invoice = await Invoice.findOne({ invoiceNumber });

    if (!invoice) {
      res.status(400).json({
        status: false,
        status_code: 400,
        message: "Invoice not found",
      });
    } else {
      const rawDate = new Date();
      const day = String(rawDate.getDate()).padStart(2, "0");
      const month = String(rawDate.getMonth() + 1).padStart(2, "0");
      const year = rawDate.getFullYear();

      const invoiceDate = `${day}/${month}/${year}`;

      const baseUrl =
        process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

      const clientEmail = invoice.clientEmail;
      const dueDate = invoice.dueDate;

      // Load HTML template
      const templateUrl =
        "https://en7bfhvcnyczqxh0.public.blob.vercel-storage.com/client-invoice-agreement-store/templates/template.html";
      let html = await fetch(templateUrl).then((res) => res.text());

      let dueDateRow = "";

      if (invoice.paymentstatus === "Due") {
        dueDateRow = `
    <tr>
      <td style="padding: 20px 0">
        <table width="100%">
          <tr>
            <td
              width="50%"
              style="
                font-size: 20px;
                font-family: 'Geologica', Arial, Helvetica, sans-serif;
              "
            >
              Due Date
            </td>
            <td
              width="50%"
              style="
                text-align: right;
                font-size: 20px;
                font-family: 'Geologica', Arial, Helvetica, sans-serif;
              "
            >
              ${dueDate}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
      }
      html = html.replace(/{{dueDateRow}}/g, dueDateRow || "");
      const replacements = {
        invoiceNumber: invoice.invoiceNumber || "",
        secureToken: invoice.secureToken || null,
        invoiceDate: invoiceDate,
        clientName: invoice.clientName || "",
        clientEmail: invoice.clientEmail || "",
        projectName: invoice.projectName || "None",
        billperiods: invoice.billperiod,
        projectName: invoice.projectName || "N/A",
        pay: invoice.pay || "N/A",
        paymentstatus: invoice.paymentstatus || "N/A",
        baseUrl: baseUrl,
      };

      Object.entries(replacements).forEach(([key, value]) => {
        html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
      });
      await sendMail({ clientEmail, html });

      res
        .status(200)
        .json({ success: true, statuscode: 200, message: "Sent to client" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//=====Update InvoiceSlip=====//
const updateInvoice = async (req, res) => {
  try {
    const invoiceNumber = req.params.invoiceNumber;

    // Find the invoice
    const invoice = await Invoice.findOne({ invoiceNumber });
    if (!Invoice) {
      return res
        .status(404)
        .json({ success: false, status_code: 404, error: "Invoice not found" });
    }
    const updatableFields = [
      "projectName",
      "clientName",
      "clientEmail",
      "dueDate",
      "billperiod",
      "advancepayment",
      "totalpayment",
      "services",
      "pay",
      "paymentstatus",
    ];

    // Check if all required fields are present in req.body
    const missingFields = updatableFields.filter(
      (field) => !req.body.hasOwnProperty(field)
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        status_code: 400,
        error: "Missing required fields",
        missingFields,
      });
    }

    updatableFields.forEach((field) => {
      if (req.body[field]) {
        invoice[field] = req.body[field];
      }
    });

    const updatedInvoice = await invoice.save();

    res
      .status(200)
      .json({ success: true, status_code: 200, invoice: updatedInvoice });
  } catch (err) {
    console.error("Update invoice error:", err);
    res.status(500).json({ status: false,status_code: 500, message: "Internal Server Error" });
  }
};

//=====Search and download invoice by query=====//

const getInvoiceByQuery = async (req, res) => {
  try {
    const { clientname, invoiceNumber, date } = req.query;

    const query = {};

    if (clientname) {
      query.clientName = { $regex: new RegExp(clientname, "i") };
    }

    if (invoiceNumber) {
      query.invoiceNumber = invoiceNumber;
    }
    if (date) {
      // Convert DD/MM/YYYY to start and end Date objects
      const [day, month, year] = date.split("/");

      const start = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
      const end = new Date(`${year}-${month}-${day}T23:59:59.999Z`);

      query.createdAt = { $gte: start, $lte: end };
    }

    const invoices = await Invoice.find(query).sort({ createdAt: -1 });

    if (!invoices.length) {
      return res.status(404).json({ status: false,status_code: 404, message: "No matching invoices found" });
    }

    res.status(200).json({status: true,status_code: 200,invoices});
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false,status_code: 500, message: "Internal Server Error" });
  }
};

//=====Client download invoice by client name=====//
const downloadInvoice = async (req, res) => {
  try {
    const secureToken = req.query.secureToken || req.params.secureToken;
    const invoice = await Invoice.findOne({ secureToken });

    const template404Url =
      "https://en7bfhvcnyczqxh0.public.blob.vercel-storage.com/client-invoice-agreement-store/templates/404.html";
    let url = await fetch(template404Url).then((res) => res.text());

    if (!invoice)
      return res
        .status(404)
        .send(url);

    const templateUrl =
      "https://en7bfhvcnyczqxh0.public.blob.vercel-storage.com/client-invoice-agreement-store/templates/invoice.A4.html";
    let html = await fetch(templateUrl).then((res) => res.text());

    const replacements = {
      invoiceNumber: invoice.invoiceNumber || "",
      invoiceDate: new Date(invoice.createdAt).toLocaleDateString("en-GB"),
      clientName: invoice.clientName || "",
      clientEmail: invoice.clientEmail || "",
      advancepayment: `${invoice.advancepayment || "None"}`,
      grandTotal: `${invoice.totalpayment || 0}`,
      amountToWords: numberToWords(invoice.totalpayment),
      projectName: invoice.projectName || "N/A",
      pay: invoice.pay || "N/A",
      paymentstatus: invoice.paymentstatus || "N/A",
    };

    Object.entries(replacements).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
    });

    const invoiceItems =
      invoice.services
        ?.map((item) => {
          const name = item.name || "none";
          const qty = item.qty || 0;
          const des = item.des || "none";
          const rate = `${item.amount || 0}`;
          const total = `${item.totalamount}`;
          return `
            <tr style="background-color:#f9f9f9;">
              <td><b>${name}</b></td>
              <td>${des}</td>
              <td>${qty}</td>
              <td>${rate}</td>
              <td>${total}</td>
            </tr>
          `;
        })
        .join("") || '<tr><td colspan="4">No services found</td></tr>';

    html = html.replace("{{invoiceItems}}", invoiceItems);

    // Launch headless Chromium from AWS Lambda
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${invoice.invoiceNumber}.pdf`
    );
    res.status(200).send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ status: false,status_code: 500, message: "Could not generate PDF" });
  }
};

//====Invoice send=====//

module.exports = {
  sendInvoice,
  createInvoice,
  updateInvoice,
  downloadInvoice,
  getInvoiceByQuery,
};
