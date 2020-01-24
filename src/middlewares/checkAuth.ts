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
			const { last_seen, _id, email, fullname, avatar } = user.data._doc;
			req.user = { last_seen, _id, email, fullname, avatar };
			next();
		})
		.catch(err => {
			res.status(403).end();
		});
};
