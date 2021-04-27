const { response } = require('express');
const { Producto } = require('../models');

const obtenerProductos = async( req, res = response ) => {

    // Obtener los query params
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments( query ),
        Producto.find( query )
            .skip( Number( desde ) )
            .limit( Number( limite ) )
            .populate( 'usuario', 'nombre' )
            .populate( 'categoria', 'nombre' )
    ]);

    res.json({
        total,
        productos
    });

}

const obtenerProducto = async( req, res ) => {

    // Obtener el id de los parametros
    const { id } = req.params;

    // Obtener la categoria de la BD
    const producto = await Producto.findById( id )
                        .populate( 'usuario', 'nombre' )
                        .populate( 'categoria', 'nombre' );

    res.json({
        producto
    })

}

const crearProducto = async( req, res ) => {

    const nombre = req.body.nombre.toUpperCase();
    const { _id, __v, estado, usuario, precio, categoria, descripcion, disponible } = req.body;

    const productoDB = await Producto.findOne({ nombre });

    // Comprobar si existe
    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id, // viene en la req cuando se valida el token con usuario valido
        precio,
        categoria,
        descripcion,
        disponible
    }

    // Preparar la data para insertar una nueva categoria
    const producto = new Producto( data );
    
    // Grabar en DB
    await producto.save();

    res.status(201).json({
        producto
    })

}

const actualizarProducto = async( req, res ) => {

    // Obtener id de los parametros
    const { id } = req.params;
    // Obtener body
    const { _id, __v, estado, ...data } = req.body;

    if ( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate( id , data, { new: true } )
                                    .populate( 'usuario', 'nombre' )
                                    .populate( 'categoria', 'nombre' );

    res.json({
        producto
    });

}

const eliminarProducto = async( req, res ) => {

    // Obtener la id de los parametros
    const { id } = req.params;

    // Cambiar el estado a la producto
    const producto = await Producto.findByIdAndUpdate( id , { estado: false }, { new: true });

    res.json({
        producto
    });

}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}