import express from 'express';
import { UserModel } from '../models';

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

	create(req: express.Request, res: express.Response) {
		const { email, fullname, password } = req.body;
		const postData = { email, fullname, password };
		const user = new UserModel(postData);
		user
			.save()
			.then((obj: any) => res.json(obj))
			.catch(err => res.json(err));
	}

	async delete(req: express.Request, res: express.Response) {
		const { id } = req.params;
		try {
			const user = await UserModel.findOneAndRemove({ _id: id })
			user
				? res.json({ message: `User deleted: ${user.fullname}` })
				: res.json({ message: `User is not found. Id: ${id}` });
		} catch (err) {
			res.json({ message: err });
		}
	}

	// delete(req: express.Request, res: express.Response) {
	// 	const { id } = req.params;
	// 	UserModel.findOneAndRemove({ _id: id })
	// 		.then(user => {
	// 			user
	// 				? res.json({ message: `User deleted: ${user.fullname}` })
	// 				: res.json({ message: `User is not found. Id: ${id}` });
	// 		})
	// 		.catch(err => res.json({ message: err }));
	// }
}
