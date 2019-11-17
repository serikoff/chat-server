import express from 'express';
import { MessageModel } from '../models';

export default class MessageController {
	index(req: express.Request, res: express.Response) {
		const { dialog } = req.query;
		MessageModel.find({ dialog })
			.populate(['dialog'])
			.exec((err, messages) =>
				err
					? res.status(404).json({ message: 'Messages not found :(' })
					: res.json(messages)
			);
	}

	// show(req: express.Request, res: express.Response) {
	// 	const id: string = req.params.id;
	// 	DialogModel.findById(id, (err, user) =>
	// 		err ? res.status(404).json({ message: 'Not found user :(' }) : res.json(user)
	// 	);
	// }

	// getMe() {
	// 	// TODO: make return info about me (autentification)
	// }

	create(req: express.Request, res: express.Response) {
		const userID = '5dd12a79eb292f18e6492ca9';
		const postData = {
			dialog: req.body.dialog_id,
			user: userID,
			text: req.body.text,
		};
		const message = new MessageModel(postData);
		message
			.save()
			.then((obj: object) => res.json(obj))
			.catch(err => res.json(err));
	}

	delete(req: express.Request, res: express.Response) {
		const { id } = req.params;
		MessageModel.findOneAndRemove({ _id: id })
			.then(message =>
				message
					? res.json({ message: `Message deleted: ${id}` })
					: res.json({ message: `Message is not found. Id: ${id}` })
			)
			.catch(err => res.json({ message: err }));
	}
}
