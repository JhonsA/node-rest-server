const path = require('path');
const fs = require('fs');

// Configuración cloudinary
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require('express');
const { subirArchivo } = require('../helpers');

const { Usuario, Producto } = require('../models');

const cargarArchivo = async( req, res = response ) => {

    try {
        // text, md
        // const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos' );

        // Imagenes
        const nombre = await subirArchivo( req.files, undefined, 'imgs' );
        res.json({
            nombre
        });
        
    } catch ( msg ) {
        res.status(400).json({ msg })
    }

}

const actualizarImagen = async( req, res = response ) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById( id );
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }

            break;
    
        default:
            return res.status(500).json({
                msg: 'Colección no implementada, hablar con el administrador'
            });
    }

    // Limpiar imagenes previas
    if ( modelo.img ) {
        // Construimos el path de la imagen
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        // Usamos FileSystem para verificar si la imagen existe
        if ( fs.existsSync( pathImagen ) ) {
            // Si existe la borra
            fs.unlinkSync( pathImagen );
        }
    }

    // Subimos la imagen con el nombre de la respectiva coleccion
    const nombre = await subirArchivo( req.files, undefined, coleccion );
    // Seteamos el nombre de la imagen la propiedad del modelo
    modelo.img = nombre;

    // Guardamos en la BD
    await modelo.save();

    res.json({
        modelo
    });

}

const actualizarImagenCloudinary = async( req, res = response ) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById( id );
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }

            break;
    
        default:
            return res.status(500).json({
                msg: 'Colección no implementada, hablar con el administrador'
            });
    }

    // Limpiar imagenes previas
    if ( modelo.img ) {
        // Cortamos el path por /
        const nombreArr = modelo.img.split('/');
        // Obtenemos la ultima parte del arreglo
        const nombre = nombreArr[ nombreArr.length - 1 ];
        // Cortamos el nombre por . y desestructuramos el public_id de la imagen
        const [ public_id ] = nombre.split('.');
        // Borramos de cloudinary enviando la id
        cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    // Seteamos el nombre de la imagen la propiedad del modelo
    modelo.img = secure_url;

    // Guardamos en la BD
    await modelo.save();

    res.json({
        modelo
    });

}

const mostrarImagenCloudinary = async( req, res = response ) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById( id );
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }

            break;
    
        default:
            return res.status(500).json({
                msg: 'Colección no implementada, hablar con el administrador'
            });
    }

    // Verificar imagen
    if ( modelo.img ) {
        return res.json({
            img: modelo.img
        });
    }

    const pathImagen = path.join( __dirname, '../assets/no-image.jpg');
    res.sendFile( pathImagen );
}

const mostrarImagen = async( req, res = response ) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById( id );
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }

            break;
    
        default:
            return res.status(500).json({
                msg: 'Colección no implementada, hablar con el administrador'
            });
    }

    // Verificar imagen
    if ( modelo.img ) {
        // Construimos el path de la imagen
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        // Usamos FileSystem para verificar si la imagen existe
        if ( fs.existsSync( pathImagen ) ) {
            // enviamos la imagen
            return res.sendFile( pathImagen );
        }
    }

    const pathImagen = path.join( __dirname, '../assets/no-image.jpg');
    res.sendFile( pathImagen );
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
    mostrarImagenCloudinary
}