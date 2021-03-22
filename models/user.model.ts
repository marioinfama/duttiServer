
import { Schema, model, Document } from 'mongoose';
//import bcrypt from 'bcrypt';

var bcrypt = require('bcryptjs');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [ true, 'El nombre es necesario' ]
    },
    lastName: {
        type: String,
        required: [ true, 'El apellido es necesario' ]
    },
    username: {
        type: String,
        required: [ true, 'El usuario es necesario' ]
    },
    email: {
        type: String,
        unique: true,
        required: [ true, 'El correo es necesario' ]
    },
    password: {
        type: String,
        required: [ true, 'La contraseña es necesaria']
    }

});


userSchema.method('compararPassword', function( password: string = ''): boolean {

    if (  bcrypt.compareSync( password, this.password ) ) {
        return true;
    } else {
        return false;
    }

});



interface IUser extends Document {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;

    compararPassword(password: string): boolean;
}



export const User = model<IUser>('User', userSchema);
