import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
    try {
        const {token} = req.headers;
        if(!token) {
            return res.json({success: false, message: "Login não autorizado, Tente novamente"})
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASS) {
            res.json({success: false, message: "Login não autorizado, Tente novamente"})
        }
        next();
    } catch (error) {
        console.log(error)
         res.json({success: false, message: error.message})
    }
}


export default adminAuth;