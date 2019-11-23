import { verifyJwtToken } from '../utils';

export default (req: any, res: any, next: any) => {
	if (req.path === '/user/login'
			|| req.path === '/user/registration'
			//|| req.path === `${req.path}`
			) {
		return next();
	}

	const token = req.headers.token;

	verifyJwtToken(token)
		.then((user: any) => {
			req.user = user;
			next();
		})
		.catch(err => {
			res.status(403).json({ message: 'You are not autorized.' });
			console.log(err);
			console.log(`Autorization error! Token: ${token}`);
		});
};
