const cookie = require('cookie');

export default function handler(req, res){

    res.setHeader('Set-Cookie', cookie.serialize('token', '',  {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,    // --> Expire Cookie Immediately
        path: '/'
    }));

    res.status(200).json({message: 'Logout successful'});

}