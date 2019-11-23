import mongoose, { Schema, Document } from 'mongoose';
import { isEmail } from 'validator';
import { generatePassHash } from '../utils';

export interface IUser extends Document {
	email: string;
	fullname: string;
	password: string;
	confirmed: boolean;
	avatar?: string;
	confirm_hash?: string;
	last_seen?: Date;
}

const UserSchema = new Schema(
	{
		email: {
			type: String,
			require: 'Email adress is required',
      validate: [isEmail, 'Invalid email'],
      unique: true,
		},
		avatar: String,
		fullname: {
			type: String,
			require: 'Fullname is required',
		},
		password: {
			type: String,
			require: 'Password is required',
		},
		confirmed: {
			type: Boolean,
			default: false,
		},
		confirm_hash: String,
		last_seen: {
			type: Date,
			default: new Date(),
		},
	},
	{
		timestamps: true,
	}
);

UserSchema.pre('save', async function(next){
	const user: any = this;
		if (!user.isModified('password')) return next();
		const hash = await generatePassHash(user.password).catch(err => next(err));
		user.password = String(hash);
		next();
})


const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
