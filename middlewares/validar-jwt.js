const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if( !token ) {
        return res.status(401).json({
            msg: 'No hay un token en la petición'
        });
    }

    try {

        // Verifica si el token es valido
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        // Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById( uid );

        if ( !usuario ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe DB'
            });
        }

        // Verificar si uid tiene estado en true
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no válido - estado false'
            });
        }

        // Lo enviamos como una nueva propiedad dentro del objeto request, por lo cual luego de pasar este middleware
        // los siguientes middlewares inclusive el controlador tienen el usuario en la request
        // contiene la informacion del usuario que realizo la acción
        req.usuario = usuario;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });

    }

}

module.exports = {
    validarJWT
}