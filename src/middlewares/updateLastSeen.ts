import express from 'express';
import { UserModel } from '../models';

export default (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	//const { _id } = req.user;
	const _id = '5dd592a3ee9d1e3fa8a36a65';
	UserModel.findOneAndUpdate({ _id }, { last_seen: new Date() }, () => {});
	next();
};
