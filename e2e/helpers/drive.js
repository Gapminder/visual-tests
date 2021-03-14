const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const jwtClient = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(new RegExp('\\\\n', '\g'), '\n'),
  ['https://www.googleapis.com/auth/drive'],
  null
);

const drive = google.drive({ version: 'v3', auth: jwtClient });
let filesCount;

exports.deleteDir = (dir) => {
  readdir(dir, async (files) => {
    for (const file of files) {
      fs.unlink(path.join(dir, file), err => {
        if (err) throw err;
      });
    }
  });
}

exports.uploadFiles = uploadFiles = async (dir, driveID) => {
  await readdir(dir, async (files) => {
    for (const file of files) {
      await upload(file, dir, driveID);
    }
    await sleep();
  });
}

exports.uploadMissingFiles = async (dir, driveID) => {
  var lists = await listFiles(driveID);
  if (lists.length > 0) {

    await readdir(dir, async (files) => {
      for (const file of files) {

        for (const list of lists) {
          if (file == list.name) {
            files = files.filter((ele) => {
              return ele != file;
            });
          }
        }
      }
      filesCount = files.length;
      for (const file of files) {
        await upload(file, dir, driveID);
      }
      await sleep();
    });

  } else {
    await uploadFiles(dir, driveID);
  }
}

exports.downloadFiles = async (dir, driveID) => {
  var lists = await listFiles(driveID);
  for (const list of lists) {
    var { data } = await drive.files.get({ fileId: list.id, alt: "media" }, { responseType: "arraybuffer" });
    await fs.writeFile(dir + '/' + list.name, Buffer.from(data), (err) => { });
  }
}

exports.listFiles = listFiles = async (driveID) => {
  var listFiles = await drive.files.list({ q: "'" + driveID + "' in parents" });
  listFiles = listFiles.data.files;
  filesCount = listFiles.length;
  return listFiles;
}

exports.deleteFiles = async (driveID) => {
  var lists = await listFiles(driveID);
  for (const list of lists) {
    await drive.files.delete({ fileId: list.id });
  }
  await sleep();
}

async function upload(file, dir, driveID) {
  await drive.files.create({
    resource: { name: file, parents: [driveID] },
    media: { mimeType: 'image/png', body: fs.createReadStream(dir + '/' + file) },
    fields: 'id'
  });
}

async function readdir(dir, callback) {
  await fs.readdir(dir, (err, files) => {
    if (err) throw err;
    filesCount = files.length;
    callback(files);
  });
}

function sleep() {
  var ms = filesCount * 500;
  filesCount = null;
  //console.log('Files upload/delete to/from Google-Drive will takes approx. ' + ms + 'ms');
  return new Promise(resolve => setTimeout(resolve, ms));
}