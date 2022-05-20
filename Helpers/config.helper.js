/**
 *
 * Configuration for application
 *
 * @param
 */
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

module.exports = {
  dbUrl: process.env.DATABASE_URL || process.env.DATABASE_URL_LOCAL,
  secret: process.env.SECRET || "mexWb02isI",
  port_socket: process.env.PORT_SOCKET || 3006,
  port: process.env.PORT || 3005,
  dirImage: "Uploads/images",
  dirPDF: "Uploads/pdf",
  dirCSV: "Uploads/csv",
  client_url: process.env.CLIENT_URL || 'http://localhost:4200',
  pathPuppeteer: process.env.PUPPETEER || "",
};
