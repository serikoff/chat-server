import { Request, Response } from 'express';
import { Server } from 'socket.io';

import mongoose, { Schema, Document } from 'mongoose';

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

	delete = async (req: Request, res: Response) => {
		const { id } = req.query;
		const { _id } = req.user;

		try {
			const messageForRemove: any = await MessageModel.findById(id);
			if (messageForRemove.user.toString() !== _id) return res.status(404).end();
			const dialogId = messageForRemove.dialog;
			const messageId = messageForRemove._id;
			await messageForRemove.remove();
			const dialog: any = await DialogModel.findById(dialogId);
			const lastMessageId = dialog.lastMessage.toString();
			const newLastMessage: any = await MessageModel.findOne(
					{ dialog: dialogId },
					{},
					{ sort: { createdAt: -1 } }
				);

			if (!newLastMessage) {
				await DialogModel.findOneAndRemove({ _id: dialogId });
			}
			if (newLastMessage && lastMessageId === messageId.toString()) {
				dialog.lastMessage = newLastMessage._id;
				await dialog.save();
			}

			res.status(200).end();
		} catch (err) {
			res.status(500).end();
		}
	};
}
