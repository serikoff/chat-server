import { Request, Response } from 'express';
import { Server } from 'socket.io';

import { DialogModel, MessageModel } from '../models';

export default class DialogController {
	io: Server;
	constructor(io: Server) {
		this.io = io;
	}

	index = (req: Request, res: Response) => {
		const { _id } = req.user;
		DialogModel.find()
			.or([{ author: _id }, { partner: _id }])
			.populate(['author', 'partner'])
			.populate({
				path: 'lastMessage',
				populate: {
					path: 'user',
				},
			})
			.exec((err, dialogs) => {
				const newDialogs = dialogs.map((dialog: any) => {
					const { author, partner, lastMessage } = dialog;
					return {
						...dialog._doc,
						author: { ...author._doc, password: '' },
						partner: { ...partner._doc, password: '' },
						lastMessage: { ...lastMessage._doc, user: { ...lastMessage.user._doc, password: '' } },
					};
				});
				return err ? res.status(404).end() : res.json(newDialogs).end();
			});
	};

	create = async (req: Request, res: Response) => {
		const { partner, text } = req.body;
		const author = req.user._id;
		try {
			const dialog: any = await new DialogModel({ author, partner }).save();
			const message = await new MessageModel({
				dialog: dialog._id,
				user: author,
				text,
			}).save();
			dialog['lastMessage'] = message._id;
			this.io.emit('SERVER:DIALOG_CREATED', {
				dialog: { ...dialog._doc, lastMessage: message },
				message,
			});

			res.status(200).end();
			await dialog.save();
		} catch (err) {
			res.status(500).end();
		}
	};

	delete = (req: Request, res: Response) => {
		const { id } = req.params;
		DialogModel.findOneAndRemove({ _id: id })
			.then(dialog => {
				dialog
					? res.json({ message: `Dialog deleted: ${dialog.author}` })
					: res.json({ message: `Dialog is not found. Id: ${id}` });
			})
			.catch(err => res.json({ message: err }));
	};
}
