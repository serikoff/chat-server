import mongoose, { Schema, Document } from 'mongoose';
import { isEmail } from 'validator';
import { generatePassHash } from '../utils';
import { differenceInMinutes } from 'date-fns';

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

UserSchema.virtual('isOnline').get(function(this: any) {
	return differenceInMinutes(new Date(), this.last_seen) < 5;
});

UserSchema.set("toJSON", { virtuals: true });


UserSchema.pre('save', async function(next){
	const user: any = this;
		if (!user.isModified('password')) return next();
		const passHash = await generatePassHash(user.password).catch(err => next(err));
		const confirmHash = await generatePassHash(user.password + new Date()).catch(err => next(err));

		user.password = String(passHash);
		user.confirm_hash = String(confirmHash);

		next();
})


const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
