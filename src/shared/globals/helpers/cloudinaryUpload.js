const cloudinary = require("cloudinary");

export function uploads(file, public_id, overwrite, invalidate) {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        public_id,
        overwrite,
        invalidate,
      },
      (error, result) => {
        if (error) resolve(error);
        resolve(result);
      }
    );
  });
}
