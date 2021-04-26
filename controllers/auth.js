const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async( req, res = response ) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el email existe ( usuario )
        const usuario = await Usuario.findOne({ correo });
        if( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario o Password no son correctos - correo'
            });
        }

        // Verificar si el usuario esta activo
        if( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario o Password no son correctos - estado: false'
            });
        }

        // Verficiar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario o Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salio mal, comuniquese con el administrador'
        })
    }

}

const googleSignIn = async( req, res = response ) => {

    const { id_token } = req.body;

    try {

        const { correo, nombre, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            // Tengo que crear al usuario
            const data = {
                nombre,
                correo,
                password: ':)',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario tiene el estado en false
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario desactivado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        });

    } catch (error) {

        res.status(400).json({
            msg: 'Token de Google no es válido'
        })
    }

}

module.exports = {
    login,
    googleSignIn
}