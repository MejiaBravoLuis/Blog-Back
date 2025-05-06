import jwt from 'jsonwebtoken';
import User from '../users/user.model.js';

export const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            msg: "There is no token in the request"
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                msg: 'User not found in database'
            });
        }

        if (!user.status) {
            return res.status(401).json({
                msg: 'Invalid token, user is inactive'
            });
        }

        req.user = user;
        next();

    } catch (e) {
        console.log(e);
        return res.status(401).json({
            msg: "Invalid token"
        });
    }
};
