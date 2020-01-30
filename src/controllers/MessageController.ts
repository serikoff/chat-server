import { Request, Response } from 'express';
import mongoose, { Schema, Document } from 'mongoose';
import { Server } from 'socket.io';
import cloudinary from '../core/cloudinary';

import { MessageModel, DialogModel, UploadFileModel } from '../models';

export default class MessageController {
	io: Server;
	constructor(io: Server) {
		this.io = io;
	}

	index = (req: Request, res: Response) => {
		const { dialog } = req.query;
		const userId = req.user._id;

		MessageModel.updateMany(
			{ dialog: dialog, user: { $ne: userId }, readed: false },
			{ $set: { readed: true } },
			err => err && res.status(500).end()
		);

		MessageModel.find({ dialog })
			.populate(['dialog', 'user', 'attachments'])
			.exec((err, messages) =>
				err ? res.status(404).json({ message: 'Messages not found' }) : res.json(messages)
			);
	};

	create = async (req: Request, res: Response) => {
		const { _id, last_seen, email, fullname, avatar } = req.user;
		const { text, dialog_id, attachments } = req.body;
		try {
			const message = await new MessageModel({
				user: _id,
				dialog: dialog_id,
				text,
				attachments,
			}).save();

			message.populate('dialog', async (err, newMessage: any) => {
				if (err) {
					res.status(500).end();
				}

				DialogModel.findOneAndUpdate(
					{ _id: dialog_id },
					{
						lastMessage: newMessage._id,
					},
					{ upsert: true },
					(err, _newDialog) => {
						if (err) res.status(500).end();
					}
				);
				const newAttachments = await UploadFileModel.find({
					_id: { $in: attachments.map((item: any) => mongoose.Types.ObjectId(item)) },
				});
				this.io.emit('SERVER:NEW_MESSAGE', {
					...newMessage._doc,
					user: {
						_id,
						avatar,
						last_seen,
						email,
						fullname,
					},
					attachments: newAttachments,
				});
				res.status(200).end();
			});
		} catch (err) {
			res.status(500).end();
		}
	};

	delete = async (req: Request, res: Response) => {
		const { _id } = req.user;
		const { id } = req.query;

		try {
			const messageForRemove: any = await MessageModel.findById(id);
			if (messageForRemove.user.toString() !== _id) return res.status(404).end();

			const attachments = await UploadFileModel.find({
				_id: {
					$in: messageForRemove.attachments.map((item: any) =>
						mongoose.Types.ObjectId(item)
					),
				},
			});
			const attachmentsPublic_ids = attachments.map((item: any) => item.public_id);
			attachmentsPublic_ids.forEach(public_id =>
				cloudinary.v2.uploader.destroy(public_id)
			);

			await UploadFileModel.deleteMany({ _id: attachments });

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
