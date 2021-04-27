const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, tieneRole } = require('../middlewares');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const { 
    obtenerProductos, 
    obtenerProducto, 
    crearProducto, 
    actualizarProducto, 
    eliminarProducto 
} = require('../controllers/productos');

const router = Router();

router.get('/', obtenerProductos);

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto );

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria').custom( existeCategoriaPorId ),
    check('categoria', 'No es un ID válido').isMongoId(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    validarCampos
], crearProducto );

router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto );

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], eliminarProducto );

module.exports = router;