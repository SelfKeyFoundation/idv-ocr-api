const { createCanvas, loadImage } = require('canvas');

declare var sails: any;

export function process(req:any, res:any, next: Function):any {

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
      loadImage(uploadedImage[0].fd)
        .then((image) => {
          let c = createCanvas(image.width, image.height);
          let ctx = c.getContext('2d');
          ctx.drawImage(image, 0, 0);
          let base64 = c.toDataURL('image/jpeg');
          res.status(200).send({ result: base64 });
        })
        .catch((err) => {
          res.status(500).send({ error: err });
        });
    } else {
      res.status(500).send({ error: 'Upload error' });
    }
  });
}
