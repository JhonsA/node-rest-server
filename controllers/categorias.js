const { response } = require('express');
const { Categoria } = require('../models');

const obtenerCategorias = async( req, res = response ) => {

    // Obtener los query params
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments( query ),
        Categoria.find( query )
            .skip( Number( desde ) )
            .limit( Number( limite ) )
            .populate( 'usuario', 'nombre' )
    ]);

    res.json({
        total,
        categorias
    })

}

const obtenerCategoria = async( req, res = response ) => {

    // Obtener el id de los parametros
    const { id } = req.params;

    // Obtener la categoria de la BD
    const categoria = await Categoria.findById( id ).populate( 'usuario', 'nombre' );

    res.json({
        categoria
    })

}

const crearCategoria = async( req, res = response ) => {
    
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    // Comprobar si existe
    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        })
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id // viene en la req cuando se valida el token con usuario valido
    }

    // Preparar la data para insertar una nueva categoria
    const categoria = new Categoria( data );
    
    // Grabar en DB
    await categoria.save();

    res.status(201).json({
        categoria
    })

}

const actualizarCategoria = async( req, res = response ) => {

    // Obtener id de los parametros
    const { id } = req.params;
    // Obtener body
    const { _id, estado, __v, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id , data, { new: true } );

    res.json({
        categoria
    })

}

const borrarCategoria = async( req, res = response ) => {
    
    // Obtener la id de los parametros
    const { id } = req.params;

    // Cambiar el estado a la categoria
    const categoria = await Categoria.findByIdAndUpdate( id , { estado: false }, { new: true });

    res.json({
        categoria
    });

}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}