import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
	dialog: {
		type: Schema.Types.ObjectId,
		ref: string,
		require: true,
	};
	text: {
		type: string,
		require: boolean,
	};
	unread: {
		type: boolean,
		default: boolean,
	};
}

const MessageSchema = new Schema(
	{
		dialog: {
			type: Schema.Types.ObjectId,
			ref: 'Dialog',
			require: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			require: true,
		},
		text: {
			type: String,
			require: Boolean,
		},
		unread: {
			type: Boolean,
			default: false,
		},
		//attachmens: []
	},
	{ timestamps: true }
);

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;
