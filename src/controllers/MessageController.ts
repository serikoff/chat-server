import { Request, Response } from 'express';
import { Server } from 'socket.io';

import { MessageModel, DialogModel } from '../models';

export default class MessageController {
	io: Server;
	constructor(io: Server) {
		this.io = io;
	}

	index = (req: Request, res: Response) => {
		const { dialog } = req.query;
		MessageModel.find({ dialog })
			.populate(['dialog', 'user']) // delete 'user' ?
			.exec((err, messages) =>
				err ? res.status(404).json({ message: 'Messages not found' }) : res.json(messages)
			);
	};

	create = async (req: Request, res: Response) => {
		const { _id } = req.user;
		const { text, dialog_id } = req.body;
		try {
			const message = await new MessageModel({
				user: _id,
				dialog: dialog_id,
				text,
			}).save();

			message.populate('dialog', (err, newMessage: any) => {
				if (err) {
					console.log(err);
					res.status(500).end();
				}

				DialogModel.findOneAndUpdate(
					{ _id: dialog_id },
					{ lastMessage: newMessage._id },
					{ upsert: true },
					(err, _newDialog) => {
						if (err) res.status(500).end();
					}
				);

				this.io.emit('SERVER:NEW_MESSAGE', newMessage);

				res.json(newMessage).end();
			});
		} catch (err) {
			console.log(err);
			res.status(500).end();
		}
	};

	delete = (req: Request, res: Response) => {
		const { id } = req.params;
		MessageModel.findOneAndRemove({ _id: id })
			.then(message =>
				message
					? res.json({ message: `Message deleted: ${id}` })
					: res.json({ message: `Message is not found. Id: ${id}` })
			)
			.catch(err => res.json({ message: err }));
	};
}
