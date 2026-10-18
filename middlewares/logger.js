const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs.txt');

// Gelen her isteğin metodunu, adresini ve zamanını kaydeden middleware
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${req.method} ${req.url}\n`;

  console.log(logMessage.trim());

  // Log kaydını dosyaya ekle (dosya yoksa otomatik oluşturur)
  fs.appendFileSync(logFilePath, logMessage, 'utf8');

  next();
};

module.exports = logger;
