import { Router, Request, Response } from 'express';
import { User } from '../models/user.model';
import Token from '../classes/token';
import { verificaToken } from '../middlewares/autenticacion';

const userRoutes = Router();

var bcrypt = require('bcryptjs');

// Login
userRoutes.post('/login', (req: Request, res: Response ) => {

    const body = req.body;

    User.findOne({ email: body.email }, ( err, userDB ) => {

        if ( err ) throw err;

        if ( !userDB ) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }

        if ( userDB.compararPassword( body.password ) ) {

            const tokenUser = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.username,
                email: userDB.email
            });

            res.json({
                ok: true,
                token: tokenUser
            });

        } else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos ***'
            });
        }


    })


});



// Crear un usuario
userRoutes.post('/create', ( req: Request, res: Response ) => {
    let salt = bcrypt.genSaltSync(10);
    const user = {
        firstName   : req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email    : req.body.email,
        password : bcrypt.hashSync(req.body.password, salt),
    };

    User.create( user ).then( userDB => {

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.username,
            email: userDB.email
        });

        res.json({
            ok: true,
            token: tokenUser
        });


    }).catch( err => {
        res.json({
            ok: false,
            err
        });
    });




});


// Actualizar usuario
userRoutes.post('/update', verificaToken, (req: any, res: Response ) => {

    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email : req.body.email  || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    }

    User.findByIdAndUpdate( req.usuario._id, user, { new: true }, (err, userDB) => {

        if ( err ) throw err;

        if ( !userDB ) {
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.username,
            email: userDB.email
        });

        res.json({
            ok: true,
            token: tokenUser
        });


    });

});



userRoutes.get('/', [ verificaToken ], ( req: any, res: Response ) => {

    const usuario = req.usuario;

    res.json({
        ok: true,
        usuario
    });

});


export default userRoutes;