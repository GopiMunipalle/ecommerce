const {customAlphabet}=require("nanoid")

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 4);

function generateStoreCode() {
  return `STORE-${nanoid()}`;
}

function generateSKU(productName) {
  const namePart = productName.slice(0, 4).toUpperCase();
  
  const uniquePart = nanoid();
  
  return `${namePart}-${uniquePart}`;
}

module.exports = {
  generateStoreCode,
  generateSKU
};