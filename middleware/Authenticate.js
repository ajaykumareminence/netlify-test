import reply from "../common/reply.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AuthLog } from "../models/AuthLog.js";

export default async function Authenticate(req, res, next){
    let token = req.headers['authorization']?.split(' ')[1];
    if(!token){
        return res.status(401).json(reply.unauth())
    }
    const result = jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded)=>{
        if(err){
            return 0
        }
        return decoded;
    })
    if(!result){
        return res.status(401).json(reply.unauth())
    }
    //additional imp checks
    const auth_log = await AuthLog.findOne({
        where:{
            user_id: result.user_id,
            uuid: result.uuid
        }
    });
    if(!auth_log){
        return res.status(401).json(reply.unauth())
    }
    const user = await User.findOne({
        where: {
            id: auth_log.user_id,
        }
    })
    if(!user){
        return res.status(401).json(reply.unauth())
    }
    if(user.status == 0){
        return res.status(401).json({ status_code: 401, message: "Account blocked"})
    }
    req.user = user;
    req.uuid = auth_log.uuid;
    next()
}