import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { Server } from 'socket.io';

import { UserModel } from '../models';
import { createJwtToken } from '../utils';
import { IUser } from '../models/User';

export default class UserController {
	io: Server;
	constructor(io: Server) {
		this.io = io;
	}

	show = (req: Request, res: Response) => {
		const { id } = req.params;
		UserModel.findById(id, (err, user) =>
			err ? res.status(404).json({ message: 'Not found user!' }).end() : res.json(user).end()
		);
	};

	getMe = (req: Request, res: Response) => {
		const { _id } = req.user;
		UserModel.findById(
			_id,
			(err, user) =>
				err ? res.status(404).json({ message: 'Not found user!!' }).end() : res.json(user).end() // !!! refactoring [pass]
		);
	};

	findUsers = (req: Request, res: Response) => {
		const myId = req.user._id;
		const { name } = req.query;
		const regex = new RegExp(name, 'i');
		UserModel
			.find()
			.or([{ fullname: regex }, { email: regex }])
			.exec((err, users) => {
				const newUsers = users
					.map(({ _id, fullname, email }) => ({_id, fullname, email }))
					.filter(({ _id }) => _id.toString() !== myId);
				if (err) {
					console.log('err: findUsers', err);
					res.status(500).end();
				}
				res.json(newUsers).end();
			});
	};

	signUp = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() }).end();

		const { email, fullname, password } = req.body;
		try {
			const user = await new UserModel({ email, fullname, password }).save();
			res.json({ status: 'success', user }).end(); // refactoring password
		} catch (err) {
			res.json({ status: 'error', message: err.code || 'Server error' }).end();
			console.log('SignUp error', email, fullname, password, err.message);
		}
	};

	verify = (req: Request, res: Response) => {
		const { hash } = req.query;
		if (!hash) res.status(404).end();
		UserModel.findOne({ confirm_hash: hash }, (err, user: IUser) => {
			if (!err && user) {
				user.confirmed = true;
				user.confirm_hash = undefined;
				user.save()
				res.status(200).end();
			}
			res.status(404).end();
		});
	}

	signIn = (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.json({ status: 'error' });
		const { email, password } = req.body;
		UserModel.findOne({ email }, (err, user: IUser) => {
			if (!user) return res.json({ status: 'error' }).end();
			if (bcrypt.compareSync(password, user.password)) {
				// refactoring: add socket creation
				const token = createJwtToken(user);
				const { fullname, _id, avatar } = user;
				res.json({ status: 'success', token, user: { fullname, _id, avatar } }).end();
			} else {
				res.json({ status: 'error' }).end();
			}
		});
	};

	delete = async (req: Request, res: Response) => {
		const { id } = req.params;
		const user: any = await UserModel.findOneAndRemove({
			_id: id,
		}).catch(err => res.json({ message: err }));
		res.json({
			message: user ? `User deleted: ${user.fullname}` : `User is not found. Id: ${id}`,
		}).end();
	};
}
