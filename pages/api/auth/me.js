// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Dec 03, 2025
// File name: me.js

import {verifyToken} from "@/lib/auth";

export default function handler(req, res){

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({error: 'No token - not logged in'});
    }

    const payload = verifyToken(token)

    if(!payload){
        return res.status(401).json({error: 'Invalid or expired token'});
    }

    res.status(200).json({
        user: {
            id: payload.userId,
            email: payload.email,
            role: payload.role
        }
    });
}