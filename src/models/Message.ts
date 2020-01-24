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
	readed: {
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
		readed: {
			type: Boolean,
			default: false,
		},
		attachments: [{ type: Schema.Types.ObjectId, ref: 'UploadFile' }],
	},
	{ timestamps: true, usePushEach: true }
);

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;
