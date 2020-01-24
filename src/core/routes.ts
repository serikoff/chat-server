import { Server } from 'socket.io';
import bodyParser from 'body-parser';

import { updateLastSeen, checkAuth } from '../middlewares';
import { signInValidation, signUpValidation } from '../utils/validation';
import { UserCtrl, DialogCtrl, MessageCtrl, UploadCtrl } from '../controllers';
import multer from './multer';

export default (app: any, io: Server) => {
	app.use(checkAuth);
	app.use(bodyParser.json());
	app.use(updateLastSeen);

	const UserController = new UserCtrl(io);
	const DialogController = new DialogCtrl(io);
	const MessageController = new MessageCtrl(io);
	const UploadFileController = new UploadCtrl();

	app.get('/user/me', UserController.getMe);
	app.post('/user/signup', signUpValidation, UserController.signUp);
	app.post('/user/signin', signInValidation, UserController.signIn);
	app.post('/user/verify', UserController.verify);
	app.get('/user/find', UserController.findUsers);
	app.get('/user/:id', UserController.show);
	app.delete('/user/:id', UserController.delete);

	app.get('/dialogs', DialogController.index);
	app.post('/dialogs', DialogController.create);
	app.delete('/dialogs/:id', DialogController.delete);

	app.get('/messages', MessageController.index);
	app.post('/messages', MessageController.create);
	app.delete('/messages', MessageController.delete);

	app.post('/files', multer.single('file'), UploadFileController.create);
	app.delete('/files', UploadFileController.delete);
};
