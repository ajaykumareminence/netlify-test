import { event } from "./Emitter.js";
import { ActivityLog } from "../models/ActivityLog.js";
import _ from "lodash";
const saveActivity = async(data) => {
    const activity_data = _.pick(data, ['user_id','type','ip_address']);
    await ActivityLog.create(activity_data);
}

event.on("ACTIVITY_EVENT", saveActivity)