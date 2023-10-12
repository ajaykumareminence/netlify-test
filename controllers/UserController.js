import reply from "../common/reply.js";
import { Country } from "../models/Country.js";
import { State } from "../models/State.js";
import { User } from "../models/User.js";
import Validation from "../common/CustomValidation.js";
import bcryptjs from "bcryptjs";
import _ from "lodash";
import { AuthLog } from "../models/AuthLog.js";
import { uuid as uuidv4 } from "uuidv4";
import jwt from "jsonwebtoken";
import { event } from "../events/Emitter.js";
import "../events/ActivityEvents.js";
import { ActivityLog } from "../models/ActivityLog.js";
import { Op } from "sequelize";


async function toBeFixed(request) {
    let country_check = await Country.findByPk(request.country_id);
    if (!country_check) {
        return { status: 0, message: 'The country id is invalid' }
    }
    let state_check = await State.findByPk(request.state_id);
    if (!state_check) {
        return { status: 0, message: 'The state id is invalid' }
    }
    const email_exists = await User.findOne({
        where: {
            email: request.email
        }
    })
    if (email_exists) {
        return { status: 0, message: "Email already exists" }
    }
    const phone_exists = await User.findOne({
        where: {
            phone_number: request.phone_number
        }
    })
    if (phone_exists) {
        return { status: 0, message: "Phone number already exists" }
    }
    const name_exists = await User.findOne({
        where: {
            name: request.name
        }
    })
    if (name_exists) {
        return { status: 0, message: "This name has already exists been taken" }
    }
    return { status: 1, message: "Passed" }
}
const register = async (req, res) => {
    try {
        let request = req.body;
        let { status, message } = await Validation(request, {
            name: 'required|min:3',
            country_id: 'required|numeric',
            state_id: 'required|numeric',
            email: 'required|email',
            phone_number: 'required|numeric',
            password: 'required|password_regex',
            confirm_password: 'required|same:password'
        })
        if (!status) {
            return res.send(reply.failed(message))
        }
        const tbf_validations = await toBeFixed(request);
        if (tbf_validations.status == 0) {
            return res.send(reply.failed(tbf_validations.message))
        }
        const salt = await bcryptjs.genSalt(10);
        request.password = await bcryptjs.hash(request.password, salt);
        request = _.pick(request, ['name', 'country_id', 'state_id', 'email', 'password', 'phone_number']);
        await User.create(request);
        return res.send(reply.success('Account created successfully'))
    } catch (err) {
        console.log(err)
        return res.send(reply.failed("Err:" + err.message))
    }
}

const login = async (req, res) => {
    try {

        let request = req.body;
        let { status, message } = await Validation(request, {
            email: 'required|email',
            password: 'required|password_regex'
        })
        if (!status) {
            return res.send(reply.failed(message))
        }
        const exists = await User.findOne({
            where: {
                email: request.email
            }
        })
        if (!exists) {
            return res.send(reply.failed("Email does not exists"));
        }
        const hashPass = await bcryptjs.compare(request.password, exists.password);
        if (!hashPass) {
            return res.send(reply.failed('Wrong password'));
        }
        const auth_data = {
            user_id: exists.id,
            uuid: uuidv4()
        }
        const token = await jwt.sign(auth_data, process.env.TOKEN_SECRET, { expiresIn: '1d' });
        await AuthLog.create(auth_data);
        const user = {
            id: exists.id,
            name: exists.name,
            email: exists.email
        }
        let ip_address = req.headers['client-address'];
        if (ip_address) {
            const event_data = {
                user_id: exists.id,
                type: 'Login success',
                ip_address
            }
            event.emit('ACTIVITY_EVENT', event_data)
        }
        return res.send(reply.success('Logged in successfully', user, { token }))
    } catch (err) {
        return res.send(reply.failed("Err:" + err.message))
    }
}

const logout = async (req, res) => {
    try {

        await AuthLog.destroy({
            where: {
                uuid: req.uuid
            }
        });
        let ip_address = req.headers['client-address'];
        if (ip_address) {
            const event_data = {
                user_id: req.user.id,
                type: 'Logout from a device',
                ip_address
            }
            event.emit('ACTIVITY_EVENT', event_data)
        }
        return res.send(reply.success("Logged out from this device"))
    } catch (err) {
        return res.send(reply.failed("Err:" + err.message))
    }
}

const hardlogout = async (req, res) => {
    try {
        await AuthLog.destroy({
            where: {
                user_id: req.user.id
            }
        });
        let ip_address = req.headers['client-address'];
        if (ip_address) {
            const event_data = {
                user_id: req.user.id,
                type: 'Logout from all devices',
                ip_address
            }
            event.emit('ACTIVITY_EVENT', event_data)
        }
        return res.send(reply.success("Logged out from all devices"))
    } catch (err) {
        return res.send(reply.failed("Err:" + err.message))
    }
}

const activities = async (req, res) => {
    try {
        let { page, per_page } = req.query;
        const condition = {
            where: {
                user_id: req.user.id
            },
            order: [['id', 'DESC']],
            attributes: ['id', 'user_id', 'type', 'ip_address', 'created_at']
        }
        const final_data = await reply.paginate(ActivityLog, page, per_page, condition)
        return res.send(reply.success("All activities fetched", final_data))
    } catch (err) {
        return res.send(reply.failed("Err:" + err.message))
    }
}

const profile = async (req, res) => {
    try {
        let user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email', 'country_id', 'state_id', 'status', 'image'],
            include: [
                {
                    model: Country,
                    attributes: ['id', 'name']
                },
                {
                    model: State,
                    attributes: ['id', 'name', 'country_id']
                }
            ]
        })
        return res.send(reply.success('User details fetched successfully', user))
    } catch (err) {
        return res.send(reply.failed("Err:" + err.message))
    }
}
const imageUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.send(reply.failed('Image is required'));
        }
        await User.update({ image: req?.file?.filename }, {
            where: {
                id: req.user.id
            }
        })
        return res.send(reply.success("Image updated successfully"));
    } catch (err) {
        return res.send(reply.failed("Err:" + err.message))
    }
}

export default {
    register,
    login,
    logout,
    hardlogout,
    activities,
    profile,
    imageUpload
}