import * as faceapi from 'face-api.js';
import * as fs from 'fs';
import * as path from 'path';
import { canvas, faceDetectionOptions } from '../commons';

declare var sails: any;

const baseDir = path.resolve(__dirname, '../../output');

export async function process(req:any, res:any, next: Function): Promise<any> {

  const referenceImage = toImageFromBase64(req.body.document);
  const queryImage = toImageFromBase64(req.body.selfie);

  const resultsRef = await faceapi.detectAllFaces(referenceImage, faceDetectionOptions)
    .withFaceLandmarks()
    .withFaceDescriptors();

  const resultsQuery = await faceapi.detectAllFaces(queryImage, faceDetectionOptions)
    .withFaceLandmarks()
    .withFaceDescriptors();

  const faceMatcher = new faceapi.FaceMatcher(resultsRef);

  const labels = faceMatcher.labeledDescriptors
    .map(ld => ld.label);

  const refBoxesWithText = resultsRef
    .map(res => res.detection.box)
    .map((box, i) => new faceapi.BoxWithText(box, labels[i]));

  let results = [];

  const queryBoxesWithText = resultsQuery.map(res => {
    const bestMatch = faceMatcher.findBestMatch(res.descriptor);
    let obj = {
      match: bestMatch,
      box: res.detection.box
    };
    results.push(obj);
    return new faceapi.BoxWithText(res.detection.box, bestMatch.toString());
  });

  const outRef = faceapi.createCanvasFromMedia(referenceImage) as any;
  faceapi.drawDetection(outRef, refBoxesWithText);
  saveFile('referenceImage.jpg', outRef.toBuffer('image/jpeg'));

  const outQuery = faceapi.createCanvasFromMedia(queryImage) as any;
  faceapi.drawDetection(outQuery, queryBoxesWithText);
  saveFile('queryImage.jpg', outQuery.toBuffer('image/jpeg'));

  let response = {
    document: refBoxesWithText,
    selfie: queryBoxesWithText,
    identity: results
  };

  res.status(200).send(response);
}

function toImageFromBase64(string) {
  var image = new canvas.Image();
  image.src = string;
  return image;
};

function saveFile(fileName: string, buf: Buffer) {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
  }
  console.log(baseDir);
  fs.writeFileSync(path.resolve(baseDir, fileName), buf);
}
