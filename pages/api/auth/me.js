import {verifyToken} from "@/lib/auth";

export default function handler(req, res){

    // STEP 1: Look for the httpOnly cookie that we set during login if it exists
    const token = req.cookies.token;

    // STEP 2: Look for the httpOnly cookie that was set if they logged in
    if(!token){
        return res.status(401).json({error: 'No token - not logged in'});
    }

    // STEP 3: Decode and verify the JWT (check both signature and expiration)
    const payload = verifyToken(token)

    // STEP 4: If the token is invalid, or expired (reject)
    if(!payload){
        return res.status(401).json({error: 'Invalid or expired token'});
    }

    // STEP 5: Token is Good! Send back only the data that our frontend needs
    // DO NOT send back the password or raw token
    res.status(200).json({
        user: {
            id: payload.userId,
            email: payload.email,
            role: payload.role
        }
    });

}