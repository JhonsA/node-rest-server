const { Categoria, Usuario, Role, Producto } = require('../models');

// Valida si el rol existe en la BD
const esRolValido = async(rol = '') => {
    
    const existeRol = await Role.findOne({ rol });
    if( !existeRol ) {
        // Error personalizado que va ser atrapado por el custom
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }

}

// Verifica si el correo existe
const emailExiste = async( correo ) => {

    const existeEmail = await Usuario.findOne({ correo });
    if( existeEmail ){
        throw new Error(`El correo ${ correo }, ya está registrado`);
    }

}

// Verificar si existe un usuario con esa id
const existeUsuarioPorId = async( id ) => {

    const existeUsuario = await Usuario.findById( id );
    if( !existeUsuario ){
        throw new Error(`El Id ${ id }, no existe`);
    }

}

/**
 * Categorias
 */

// Verificar si existe la id en la BD
const existeCategoriaPorId = async( id ) => {

    const existeCategoria = await Categoria.findById( id );
    if ( !existeCategoria ) {
        throw new Error(`El id ${ id }, no existe`);
    }

}

/**
 * Productos
 */
const existeProductoPorId = async( id ) => {

    const existeProducto = await Producto.findById( id );
    if ( !existeProducto ) {
        throw new Error(`El id ${ id }, no existe`);
    }

}

/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {

    const incluida = colecciones.includes( coleccion );
    if ( !incluida ) {
        throw new Error(`La colección ${ coleccion } no es permitida - ${ colecciones }`);
    }

    return true;

}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}