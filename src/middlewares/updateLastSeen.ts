import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models';

export default (req: Request, res: Response, next: NextFunction) => {
	if (req.user) {
		const { _id } = req.user;
		UserModel.findOneAndUpdate({ _id }, { last_seen: new Date() }, { new: true }, () => {});
	}

	next();
};
