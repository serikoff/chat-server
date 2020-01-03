import jwt from 'jsonwebtoken';

export default (token: any) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET || '', (err: any, decodedUserData?: any) => {
      if (err || !decodedUserData) return reject(err);
      resolve(decodedUserData);
    })
  });
