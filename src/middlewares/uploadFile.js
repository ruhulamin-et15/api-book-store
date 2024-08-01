const multer = require("multer");
const path = require("path");
const { uploadDir } = require("../config");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024000 },
});

module.exports = upload;
