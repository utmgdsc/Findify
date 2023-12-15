# Getting Started

## Frontend `/src`:

### Install NodeJS
You can get the Latest version of NodeJS from [here](https://nodejs.org/en/) [The Official NodeJS website] follow the instructions and you’re Good to go.

### Run `npm install`
This will install all the dependecies in you machine. You need to run `npm install` in both `/src` and `/backend` folder before you run.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Database
- The database used here is [MongoDB](https://www.mongodb.org/) with [Mongoose](https://www.npmjs.com/package/mongoose) which  is a object modeling tool designed to work in an asynchronous environment. You can get started with mongoose (https://mongoosejs.com/docs/) or you can read thisawesome article on getting started with [Mongoose](https://medium.com/@scalegridio/getting-started-with-mongodb-and-mongoose-c406541d325a). 
- AWS S3 is used to store user images.


## Backend
Run the following commands to get the backend started. The backend runs on port 3000 by default.

```
cd backend
npm install
node index.js
```

> :warning: You need to create a `.env` file in the /backend folder with the AWS secret keys, email keys to run the backend. Refer to .env.example file for the structure.

