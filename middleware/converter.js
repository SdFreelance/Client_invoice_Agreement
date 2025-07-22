const puppeteer = require('puppeteer');
const fs = require('fs');
const handlebars = require('handlebars');

async function generateAgreementPDF(data, outputPath) {
  const templateHtml = fs.readFileSync('template.html', 'utf8');
  const template = handlebars.compile(templateHtml);
  const html = template(data);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html);
  await page.pdf({ path: outputPath, format: 'A4' });

  await browser.close();
}
