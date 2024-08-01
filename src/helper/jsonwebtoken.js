const jwt = require("jsonwebtoken");

const createJSONWebToken = (payload, secretKey, expiresIn) => {
  if (typeof payload !== "object" || payload === !payload) {
    throw new Error("payload must be an non-empty object");
  }
  if (typeof secretKey !== "string" || secretKey === "") {
    throw new Error("secret key must be an non-empty string");
  }
  try {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createJSONWebToken };
