const bcrypt = require('bcryptjs');

// Contraseña original
const password: string = 'Delivery1.';

// Hashear la contraseña
bcrypt.hash(password, 10, (err: Error | undefined, hash: string) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});