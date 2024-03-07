const configs = require('../config');
const AWS = require('aws-sdk');
const multer = require('multer');
const compress = require('sharp');

const s3 = new AWS.S3({
  endpoint: configs.DO_SPACES_ENDPOINT,
  region: configs.DO_SPACES_REGION,
  credentials: {
    accessKeyId: configs.DO_SPACES_KEY,
    secretAccessKey: configs.DO_SPACES_SECRET,
  },
});
const bucketName = configs.DO_SPACES_BUCKET;

module.exports.uploader = async (key, body, fileExtension) => {
  try {
    const imageBuffer = await compress(body).jpeg({ quality: 30 }).toBuffer();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileName = `${key}-${uniqueSuffix}.${fileExtension}`;
    // const fileName = `${uniqueSuffix}-${key}`;

    const params = {
      Bucket: bucketName,
      Key: `uploads/xpsc-success/${fileName}`,
      Body: imageBuffer,
      ACL: 'public-read',
    };
    return s3.upload(params).promise();
  } catch (error) {
    console.log('🌺 | uploader | error:', error);
    return {};
  }
};

const storage = multer.memoryStorage();
module.exports.upload = multer({ storage: storage });
