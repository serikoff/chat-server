import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';

// import { UserModel } from './models';
import { UserController, DialogController, MessageController } from './controllers';

const app = express();
app.use(bodyParser.json());

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
app.post('/user/registration', User.create);
app.delete('/user/:id', User.delete);

app.get('/dialogs', Dialog.index);
app.post('/dialogs', Dialog.create);
app.delete('/dialogs/:id', Dialog.delete);

app.get('/messages/', Message.index);
app.post('/messages/', Message.create);
app.delete('/messages/:id', Message.delete);

const port: number = 3000;
app.listen(port, () => {
	console.log(`It\`s work! \nServer listening on port ${port}!`);
});
