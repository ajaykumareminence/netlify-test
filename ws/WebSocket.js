import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AuthLog } from '../models/AuthLog.js';
async function Authenticate(token) {
    if(!token){
        return false;
    }
    const result = jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded)=>{
        if(err){
            return 0;
        }
        return decoded;
    })
    if(!result){
        return false;
    }
    //additional imp checks
    const auth_log = await AuthLog.findOne({
        where:{
            user_id: result.user_id,
            uuid: result.uuid
        }
    });
    if(!auth_log){
        return false;
    }
    const user = await User.findOne({
        where: {
            id: auth_log.user_id,
        },
        attributes:['id','name','email','image']
    })
    if(!user || user.status == 0){
        return false
    }
    return user;
}
export function SocketServer(server) {
    const wss = new WebSocketServer({ server });
    wss.on('connection', async function connection(ws) {
        const authorized = await Authenticate(ws["_protocol"]);
        if (!authorized) {
            return ws.send(JSON.stringify({ status: 401, message: 'Unauthorized' }))
        }
        ws.on('message', function message(data) {
            const input = JSON.parse(data.toString());
            console.log(input)
            if(input.type == "openmessage"){
                const data = {
                    msg: input.msg,
                    type: input.type,
                    user: authorized
                }
                return wss.clients.forEach(function each(client){
                    client.send(JSON.stringify(data))
                })
            }
        }); 
    });
}