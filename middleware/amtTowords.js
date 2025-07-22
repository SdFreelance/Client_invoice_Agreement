// Core function to convert integer numbers to words (no currency, no recursion issue)
const convertNumberToWords = (n) => {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (n === 0) return 'Zero';

  const numToWords = (num) => {
    if (num === 0) return '';
    if (num < 20) return a[num];
    if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? ' ' + a[num % 10] : '');
    if (num < 1000)
      return a[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numToWords(num % 100) : '');
    if (num < 100000)
      return numToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numToWords(num % 1000) : '');
    if (num < 10000000)
      return numToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numToWords(num % 100000) : '');
    return numToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numToWords(num % 10000000) : '');
  };

  return numToWords(n).trim();
};

// Wrapper to handle ₹ amount with rupees and paise
const numberToWords = (amountStr) => {
  const cleanedAmount = parseFloat(
    String(amountStr).replace(/[^0-9.]/g, "")
  ) || 0;

  const rupees = Math.floor(cleanedAmount);
  const paise = Math.round((cleanedAmount - rupees) * 100);

  let words = convertNumberToWords(rupees) + ' Rupees';
  if (paise > 0) {
    words += ' and ' + convertNumberToWords(paise) + ' Paise';
  }
  return words + ' Only';
};

module.exports = numberToWords;
