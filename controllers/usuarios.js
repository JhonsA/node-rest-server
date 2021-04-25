const { response, request } = require('express'); // Para tener ayuda de vsc
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response ) => {

    // Query params
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments( query ), // Total de registros
        Usuario.find( query ) // Todos los registros de usuarios
            .skip( Number( desde ) ) // desde que registro
            .limit( Number( limite ) ) // limite de registros
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response ) => {

    // Obtener los datos del req.body y crear la instancia del usuario
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la contraseña (salt es el num de vueltas para hacer mas complicado el metodo de encriptacion)
    const salt = bcryptjs.genSaltSync(); // default 10
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await usuario.save();

    res.status(201).json({
        usuario
    });
}

const usuariosPut = async(req, res = response ) => {

    const { id } = req.params;
    const { _id, __v, password, google, correo, ...resto } = req.body;

    // Validar contra base de datos
    if ( password ) {
        // Encriptar la contraseña (salt es el num de vueltas para hacer mas complicado el metodo de encriptacion)
        const salt = bcryptjs.genSaltSync(); // default 10
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto, { new: true } );

    res.json({
        usuario
    });
}

const usuariosDelete = async(req, res = response ) => {

    const { id } = req.params;

    // Cambiando el estado del usuario
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false }, { new: true } );

    // Obtener el usuario autenticado que viene en la request, desde validar-jwt.js
    // const usuarioAutenticado = req.usuario;

    res.json({
        usuario
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}