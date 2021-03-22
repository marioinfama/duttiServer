import Server from './classes/server';
import mongoose from 'mongoose';

import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

import userRoutes from './routes/user';

import cors from 'cors';
const server = new Server();


// Body parser
server.app.use( bodyParser.urlencoded({ extended: true }));
server.app.use( bodyParser.json() );


// FileUpload
server.app.use( fileUpload({ useTempFiles: true }) );

// Configuración CORS
server.app.use(cors({origin: true, credentials: true}))


// Rutas de mi app
server.app.use('/user', userRoutes );


// Conectar DB 
mongoose.connect('mongodb+srv://dutti:<password>@cluster0.2yakq.mongodb.net/dutti?retryWrites=true&w=majority', 
                { useNewUrlParser: true, useCreateIndex: true }, ( err ) => {

   if ( err ) throw err;

   console.log('Base de datos ONLINE');
})

// Levantar express
server.start( () => {
    console.log(`Servidor corriendo en puerto ${ server.port }`);
});