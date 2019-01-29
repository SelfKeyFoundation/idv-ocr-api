import * as faceapi from 'face-api.js';

import { canvas, faceDetectionOptions } from '../commons';

declare var sails: any;

export async function process(req:any, res:any, next: Function): Promise<any> {

  const referenceImage = toImageDataFromBase64(req.body.document);
  const queryImage = toImageDataFromBase64(req.body.selfie);

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

  let response = {
    document: refBoxesWithText,
    selfie: queryBoxesWithText,
    identity: results
  };

  res.status(200).send(response);
}

function toImageDataFromBase64(string) {
  var image = new canvas.Image();
  image.src = string;
  return image;
};
