const { validationResult } = require('express-validator');

// Confirmar errores del middleware de express-validator
const validarCampos = ( req, res, next ) => {

    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json( errors );
    }

    // Si no cayo en el return que siga con el siguiente middleware
    next();

}

module.exports = {
    validarCampos
}