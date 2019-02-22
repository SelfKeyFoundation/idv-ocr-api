const tesseract = require('node-tesseract-ocr');

const config = {
  lang: 'eng',
  oem: 1,
  psm: 3
};

declare var sails: any;

export async function process(req:any, res:any, next: Function): Promise<any> {

  // try to get uploaded file
  return new Promise((resolve, reject) => {
    return req
      .file('image')
      .upload(function (err, uploadedImage) {
        if (err) {
          return reject(err);
        } else {
          return resolve(uploadedImage);
        }
      });
  })
  .then((uploadedImage: any) => {
    if (uploadedImage && uploadedImage.length > 0) {

      tesseract.recognize(uploadedImage[0].fd, config)
        .then((text) => {
          console.log('Result:', text)
          let response = {
            document: text
          };
          res.status(200).send(response);
        })
        .catch((err) => {
          console.log('error:', err);
          res.status(500).send(err);
        });
    } else {
      res.status(500).send({ error: 'Upload error' });
    }
  });
  
}
