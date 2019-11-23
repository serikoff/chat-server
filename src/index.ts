import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import { UserController, DialogController, MessageController } from './controllers';
import { updateLastSeen, checkAuth } from './middlewares';
import { login as loginValidate, registration as regValidate } from './utils/validation';

const app = express();
dotenv.config()
app.use(bodyParser.json());
app.use(updateLastSeen);
app.use(checkAuth);

const User = new UserController();
const Dialog = new DialogController();
const Message = new MessageController();

mongoose.connect('mongodb://localhost:27017/chat', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

app.get('/user/:id', User.show);
app.post('/user/registration', regValidate, User.create);
app.delete('/user/:id', User.delete);
app.post('/user/login', loginValidate, User.login);

app.get('/dialogs', Dialog.index);
app.post('/dialogs', Dialog.create);
app.delete('/dialogs/:id', Dialog.delete);

app.get('/messages/', Message.index);
app.post('/messages/', Message.create);
app.delete('/messages/:id', Message.delete);

app.listen(process.env.PORT, () => {
	console.log(`It\`s work! \nServer is running: http://localhost: ${process.env.PORT}!`);
});
