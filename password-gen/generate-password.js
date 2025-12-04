// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Nov 29, 2025
// Last modified: Dec 03, 2025
// File name: AppNavBar.js

const bcrypt = require('bcryptjs');

console.log('Admin (admin123): ', bcrypt.hashSync('admin123', 10));
console.log('AuthorT (authort123): ', bcrypt.hashSync('authort123', 10));
console.log('AuthorL (authorl123): ', bcrypt.hashSync('authorl123', 10));