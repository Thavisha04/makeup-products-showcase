const bcrypt = require('bcryptjs');

console.log('Admin (admin123): ', bcrypt.hashSync('admin123', 10));
console.log('AuthorT (authort123): ', bcrypt.hashSync('authort123', 10));
console.log('AuthorL (authorl123): ', bcrypt.hashSync('authorl123', 10));