const { google } = require('googleapis');
const drive = google.drive({ version: 'v3' });
const fs = require('fs');

module.exports = {
  downloadImageFromDrive: async function (fileId, destination) {
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );
    response.data
      .on('end', () => console.log('Download complete'))
      .on('error', (err) => console.error('Error downloading', err))
      .pipe(fs.createWriteStream(destination));
  },
  extractDriveFileId: async function (url) {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)|id=([a-zA-Z0-9-_]+)/);
    return match ? match[1] || match[2] : null;
  },
};
