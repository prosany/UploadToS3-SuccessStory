require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  DO_SPACES_REGION: process.env.DO_SPACES_REGION,
  DO_SPACES_ENDPOINT: process.env.DO_SPACES_ENDPOINT,
  DO_SPACES_KEY: process.env.DO_SPACES_KEY,
  DO_SPACES_SECRET: process.env.DO_SPACES_SECRET,
  DO_SPACES_BUCKET: process.env.DO_SPACES_BUCKET,
  DO_IMAGE_BASE_URL: process.env.DO_IMAGE_BASE_URL,
};
