const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
];

const buscarUsuarios = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID ) {
        const usuario = await Usuario.findById( termino );
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    const regex = new RegExp( termino, 'i' ); // insensible a mayus y min
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    });

}

const buscarCategorias = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID ) {
        const categoria = await Categoria.findById( termino )
                                .populate('usuario', 'nombre');
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'i' ); // insensible a mayus y min
    const categorias = await Categoria.find({ nombre: regex, estado: true })
                                    .populate('usuario', 'nombre');

    res.json({
        results: categorias
    });

}

const buscarProductos = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID ) {
        const producto = await Producto.findById( termino )
                                        .populate('usuario', 'nombre')
                                        .populate('categoria', 'nombre');
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }

    const regex = new RegExp( termino, 'i' ); // insensible a mayus y min
    const productos = await Producto.find({ nombre: regex, estado: true })
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.json({
        results: productos
    });

}

const buscar = ( req, res = response ) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        });
    }

    switch ( coleccion ) {
        case 'categorias':
            buscarCategorias( termino, res );
            break;

        case 'productos':
            buscarProductos( termino, res );
            break;

        case 'usuarios':
            buscarUsuarios( termino, res );
            break;
    
        default:
            res.status(500).json({
                msg: 'Busqueda no implementada, hablar con el administrador'
            });
    }

}

module.exports = {
    buscar
}