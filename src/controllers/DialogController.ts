import express from 'express';
import { DialogModel, MessageModel } from '../models';

export default class DialogController {
	index(req: express.Request, res: express.Response) {
		const { authorId } = req.query;
		DialogModel.find({ author: authorId })
			.populate(['author', 'partner'])
			.exec((err, dialog) =>
				err ? res.status(404).json({ message: 'Dialog not found :(' }) : res.json(dialog)
			);
	}

	async create(req: express.Request, res: express.Response) {
		const { author, partner, text } = req.body;
		const dialog = await new DialogModel({ author, partner }).save().catch(err => err);
		res.json(dialog);
		const message = await new MessageModel({ dialog: dialog._id, user: author, text })
			.save()
			.catch(err => err);
		res.json(message);
	}

	delete(req: express.Request, res: express.Response) {
		const { id } = req.params;
		DialogModel.findOneAndRemove({ _id: id })
			.then(dialog => {
				dialog
					? res.json({ message: `Dialog deleted: ${dialog.author}` })
					: res.json({ message: `Dialog is not found. Id: ${id}` });
			})
			.catch(err => res.json({ message: err }));
	}
}
