const express = require('express');
const cors = require('cors');
const multer = require('multer');
const envs = require('./config');
const s3Upload = require('./utils/uploadToS3');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const upload = multer({
  dest: 'uploads/',
  limits: { fieldSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(csv)$/)) {
      return cb(new Error('Please upload a CSV file'));
    }
    cb(undefined, true);
  },
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/convert-csv', upload.single('file'), async (req, res) => {
  const csvToJson = require('./utils/csvUtils');
  const { file } = req;
  await csvToJson(file.path, `public/${file.originalname}.json`);
  res.json({ message: 'Conversion to JSON complete' });
});

app.get('/drive-image', async (req, res) => {
  const {
    downloadImageFromDrive,
    extractDriveFileId,
  } = require('./utils/getDriveImage');
  const fileId = await extractDriveFileId(req.query.driveLink);

  if (!fileId) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  await downloadImageFromDrive(fileId, `public/${fileId}.png`);
  res.json({ message: 'Download complete' });
});

app.post('/upload-image', s3Upload.upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileExtension = file.originalname.split('.').pop();
    const s3Response = await s3Upload.uploader(
      'batch2',
      file.buffer,
      fileExtension
    );
    return res.status(200).send(s3Response);
  } catch (error) {
    return res.status(400).json({ error: 'Upload failed' });
  }
});

app.listen(envs.PORT, () => {
  console.log(`We are up on port ${envs.PORT}`);
});
