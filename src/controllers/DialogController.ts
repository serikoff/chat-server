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

	create(req: express.Request, res: express.Response) {
		const { author, partner, text } = req.body;
		const postData = { author, partner };
		const dialog = new DialogModel(postData);
		dialog
			.save()
			.then((dialogObj: any) => {
				res.json(dialogObj);
				const message = new MessageModel({
					dialog: dialogObj._id,
					user: author,
					text,
				});
				message
					.save()
					.then(() => res.json(dialogObj))
					.catch(err => res.json(err));
			})
			.catch(err => res.json(err));
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
