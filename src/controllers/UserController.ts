import express from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { UserModel } from '../models';
import { createJwtToken } from '../utils';
import { IUser } from '../models/User';

export default class UserController {
	show(req: express.Request, res: express.Response) {
		const { id } = req.params;
		UserModel.findById(id, (err, user) =>
			err ? res.status(404).json({ message: 'Not found user :(' }) : res.json(user)
		);
	}

	getMe() {
		// TODO: make return info about me (autentification)
	}

	async create(req: express.Request, res: express.Response) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

		const { email, fullname, password } = req.body;
		const user = await new UserModel({ email, fullname, password })
			.save()
			.catch(err => err);
		res.json(user);
	}

	async delete(req: express.Request, res: express.Response) {
		const { id } = req.params;
		const user: any = await UserModel.findOneAndRemove({ _id: id }).catch(err =>
			res.json({ message: err })
		);
		res.json({
			message: user ? `User deleted: ${user.fullname}` : `User is not found. Id: ${id}`,
		});
	}

	login(req: express.Request, res: express.Response) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

		const { email, password } = req.body;
		UserModel.findOne({ email }, (err, user: IUser) => {
			if (!user) return res.status(404).json({ message: 'Not found user :(' }); // !!! refactoring

			if (bcrypt.compareSync(password, user.password)) {
				res.json({ status: 'success', token: createJwtToken(user) });
			} else {
				res.json({ status: 'error', message: 'Incorrect password or email :(' });
			}
		});
	}
}
