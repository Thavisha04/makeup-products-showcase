// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Dec 03, 2025
// File name: logout.js

const cookie = require('cookie');

export default function handler(req, res){

    res.setHeader('Set-Cookie', cookie.serialize('token', '',  {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,    // Expire Cookie Immediately
        path: '/'
    }));

    res.status(200).json({message: 'Logout successful'});

}