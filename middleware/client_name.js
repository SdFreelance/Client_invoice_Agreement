function formatClientFolder(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '_'); // "Rohan Verma" => "rohan_verma"
}
module.exports = formatClientFolder