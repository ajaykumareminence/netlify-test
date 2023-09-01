import reply from "../common/reply.js";
import { Country } from "../models/Country.js";
import { State } from "../models/State.js";

const region = async(req,res) => {
    try{
        const data = await Country.findAll({
            include:[
                {
                    model: State,
                    attributes: ['id','name','country_id']
                }
            ],
            attributes: ['id','name']
        })
        return res.send(reply.success('Regions fetched successfully', data));
    }catch(err){
        return res.send(reply.failed("Request failed!!"))
    }
}

export default {
    region
}