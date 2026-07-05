const QRCode = require("qrcode");

// Generates a base64 QR code data URL encoding the booking info
const generateQR = async (data) => {
  try {
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(data));
    return qrDataUrl;
  } catch (error) {
    throw new Error("QR generation failed: " + error.message);
  }
};

module.exports = generateQR;
