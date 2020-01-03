import { Request, Response } from 'express';
import { verifyJwtToken } from '../utils';

declare module 'express' {
  export interface Request {
    user?: any;
  }
}

export default (req: Request, res: Response, next: any) => {
	if (
			req.path === '/user/signin'
			|| req.path === '/user/signup'
			|| req.path === '/user/verify'
			) {
		return next();
	}

	const token = req.headers.token;

	verifyJwtToken(token)
		.then((user: any) => {
			req.user = user.data._doc;
			next();
		})
		.catch(err => {
			res.status(403).end();
			//console.log(`Autorization error! Token: ${token}`); // refactoring - ip
		});
};
