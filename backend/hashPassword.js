"use strict";
const bcrypt = require('bcryptjs');
// Contraseña original
const password = 'Delivery1.';
// Hashear la contraseña
bcrypt.hash(password, 10, (err, hash) => {
    if (err)
        throw err;
    console.log('Hashed password:', hash);
});
