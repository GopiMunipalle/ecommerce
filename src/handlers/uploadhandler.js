const cloudinary=require("../config/cloudinary")
const streamifier = require('streamifier');

const uploadFiles = async (files) => {
  return Promise.all(
    files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream_to_cloud_pipe = cloudinary.uploader.upload_stream(
          { folder: 'phantasm_images' },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              if (result) {
                resolve(result.secure_url);
              } else {
                reject(new Error('Upload result is undefined'));
              }
            }
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream_to_cloud_pipe);
      });
    })
  );
};

module.exports = uploadFiles;