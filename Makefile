install:
	npm install

server_start:
	npm run start

mongo_start:
	sudo service mongod start

mongo_stop:
	sudo service mongod stop

start:
	sudo service mongod start &
	npm run start

stop:
	killall node &
	sudo service mongod stop

start_osx:
	brew services start mongodb-community &
	npm run server

stop_osx:
	killall node &
	brew services stop mongodb-community
