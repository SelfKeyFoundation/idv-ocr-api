# face-rec
Selfkey Face Recognition API

## Endpoints
1) Health: a health check at `/v1/health` should return `200` [GET].

2) Convert: a image (file upload) to base64 converter at `/v1/convert` [POST].

Example:
`http://localhost:1337/v1/convert`
Data:
```
curl -X POST \
  http://localhost:1337/v1/convert \
  -H 'cache-control: no-cache' \
  -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
  -H 'postman-token: ef66c4a5-e444-aecc-56d4-2337e3fda2d7' \
  -F image=@selfie.jpg \
  -F name=selfie.jpg
```
Response:
```
{
  "result": "<BASE_64_ENCODED_STRING>"
}
```

3) Identity: a identity check at `/api/identity` [POST].

The threshold should be supplied as a query parameter.

Provide `application/json` as the `Content-Type` header.

This endpoint accepts 2 images, tries to find a face in each image, and
based on the similarity threshold supplied will determine if the faces in
the images are the same.

`POST`ed data should be a json dictionary with 2 entries. The keys provided
will be used in the response to indicate if a face was found in the image,
and the dictionary values should be the images as base64 encoded strings.

Example:  
`http://localhost:1337/v1/identity?threshold=0.4199`  
Data:  
```
{
  "document": "<BASE_64_ENCODED_STRING>",
  "selfie": "<BASE_64_ENCODED_STRING>"
}
```
Response:
```
{
  "response": {
    "found_face": {
      "image1": true,
      "image1": true
    },
    "verified": true
  },
  "status": 200
}
```

## Development
### Prerequisites
- Sails JS (https://sailsjs.com/)
- Face API JS (https://github.com/justadudewhohacks/face-api.js)

### Build
`npm install` will build and install required libraries.

### Run
`node app.js` will start the api exposed on port `1337`.

## Testing
### Benchmarking and evaluating
#todo

### Generating Testing and Validation Data
#todo

## Deploy
#todo

## Contributing
See the [contributing notes](CONTRIBUTING.md).  
