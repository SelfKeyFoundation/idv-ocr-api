declare var sails: any;

export function process(req:any, res:any, next: Function):any {
  res.status(200).send({ message: 'The FaceRec API is up and running!' });
}