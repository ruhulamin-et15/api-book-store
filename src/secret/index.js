require("dotenv").config();

const serverPort = process.env.SERVER_PORT;
const mongoURI = process.env.MONGODB_STRING;
const userDefaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH;
const bookDefaultCoverPath = process.env.DEFAULT_BOOK_COVER_PATH;
const authorDefaultImagePath = process.env.DEFAULT_AUTHOR_IMAGE_PATH;
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY;
const smtpUserName = process.env.SMTP_USER_NAME;
const smtpPassword = process.env.SMTP_PASSWORD;
const clientURL = process.env.CLIENT_URL;

module.exports = {
  serverPort,
  mongoURI,
  userDefaultImagePath,
  bookDefaultCoverPath,
  authorDefaultImagePath,
  jwtActivationKey,
  smtpUserName,
  smtpPassword,
  clientURL,
};
