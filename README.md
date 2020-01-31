
#  Chat server
[![Maintainability](https://api.codeclimate.com/v1/badges/91f539a360f43a73835d/maintainability)](https://codeclimate.com/github/serikoff/chat-server/maintainability)

This repository is the backend part of the chat.

[Chat client](https://github.com/serikoff/chat-client)

##
  **Stack:**
-   NodeJS
-   TypeScript
-   Express
-   Mongoose
-   Multer
-   Nodemailer
-   Socket.io
-   JWT
-   Cloudinary
-   MongoDB

##  Setup

[Install MongoDB](https://docs.mongodb.com/manual/installation/)

add autostart MongoDB server
```sh
$ sudo systemctl enable mongod.service
```

[Install Node.js](https://github.com/nodesource/distributions)
[Install PM2](https://pm2.keymetrics.io/docs/usage/quick-start/)

clone git and npm install
```sh
$ git clone https://github.com/serikoff/chat-server
$ cd chat-server
$ npm install
```

Environment and PM2 setting.
```sh
$ nano ecosystem.config.js
```

setup example
```sh
module.exports  =  {
	apps  :  [{
	name:  'Server-chat',
	script:  'npm',
	args:  'start',
	instances:  1,
	autorestart:  true,
	watch:  true,
	max_memory_restart:  '1G',
	env:  {
		NODE_ENV:  'production',
		PORT:  '3003',
		JWT_SECRET:  'UpFJfpWKYteH5rMHS3st',
		JWT_MAX_AGE:  '7 days',
		CLOUDINARY_NAME:  'name',
		CLOUDINARY_API_KEY:  'key',
		CLOUDINARY_API_SECRET:  'secret',
		}
	}]
};
```
[Registration in the Cloudinary](https://cloudinary.com/users/register/free)
After registering you can find  in the dashboard account details and get
CLOUDINARY_NAME,
CLOUDINARY_API_KEY,
CLOUDINARY_API_SECRET.

Use PM2 to start the server and monitor the status.
```sh
sudo pm2 start ecosystem.config.js
```

add autostart server
```sh
$ sudo pm2 startup
$ sudo pm2 save
```
