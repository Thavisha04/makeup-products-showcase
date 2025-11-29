import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-must-be-changed-in-production';
const TOKEN_EXPIRY = '7d'; // 7 days expiry

const users = [
    {
        id: '1',
        email: 'admin@gmail.com',
        password: '$2b$10$TPV4dkjYxpovqlF3TPPZ..d2cB23syCWOVSZQ7v109PKEPwBUKewe',
        role: 'admin'
    },
    {
        id: '2',
        email: 'thavisha@gmail.com',
        password: '$2b$10$bw2lvEjfX.v7mQ3HT/oAkuhi6F8eMgTUx2LfTBCppOzTkVAVCYuJ.',
        role: 'author'
    },
    {
        id: '3',
        email: 'lithasha@gmail.com',
        password: '$2b$10$oTjyLpx3T4fNW6Ez4YUvAOZKlCvUgNLHHT4FdHEuFMsKwXzsh4zRG',
        role: 'author'
    }
]

export function hashPassword(password){
    return bcrypt.hashSync(password, 10);
}

export function verifyPassword(input, hashed){
    return bcrypt.compareSync(input, hashed);
}

export function generateToken(user){
    return jwt.sign(
        {userId: user.id, email: user.email, role: user.role},
        JWT_SECRET,
        {expiresIn: TOKEN_EXPIRY}
    );
}

export function verifyToken(token){
    try{
        return jwt.verify(token, JWT_SECRET);
    }catch(err){
        return null;
    }
}

export function findUserByEmail(email){
    return users.find(u => u.email === email);
}



