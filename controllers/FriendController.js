import { Op } from "sequelize";
import reply from "../common/reply.js"
import { User } from "../models/User.js";
import { Country } from "../models/Country.js";
import { State } from "../models/State.js";
import { Friendship } from "../models/Friendship.js";

const find = async (req, res) => {
    try {
        let { name, page, per_page } = req.query;
        const sent_requests = await Friendship.findAll({
            where: {
                sender_id: req.user.id
            },
            attributes: ['id', 'receiver_id'],
            raw: true
        })
        const received_requests = await Friendship.findAll({
            where: {
                receiver_id: req.user.id
            },
            attributes: ['id', 'sender_id'],
            raw: true
        })
        const filtered_sent = sent_requests.map((user) => { return user.receiver_id });
        const filtered_received = received_requests.map((user) => { return user.sender_id });
        var filtered_requests = [...filtered_sent, ...filtered_received];
        filtered_requests.push(req.user.id);

        var condition = {
            where: {
                id: { [Op.notIn]: filtered_requests }
            },
            attributes: ['id', 'name', 'email', 'state_id', 'country_id', 'status', 'image'],
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
        };
        if (name) {
            condition.where.name = { [Op.substring]: name };
        }
        const final_data = await reply.paginate(User, page, per_page, condition)
        return res.send(reply.success("Friends suggested", final_data));
    } catch (err) {
        return res.send(reply.failed("Err: " + err.message))
    }
}

const sent_requests = async (req, res) => {
    try {
        let { name, page, per_page } = req.query;
        const sent_requests = await Friendship.findAll({
            where: {
                sender_id: req.user.id,
                is_confirmed: 0
            },
            attributes: ['id', 'receiver_id'],
            raw: true
        })

        const filtered_requests = sent_requests.map((user) => { return user.receiver_id });

        var condition = {
            where: {
                id: { [Op.in]: filtered_requests }
            },
            attributes: ['id', 'name', 'email', 'state_id', 'country_id', 'status', 'image'],
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
        };
        if (name) {
            condition.where.name = { [Op.substring]: name };
        }
        const final_data = await reply.paginate(User, page, per_page, condition)
        return res.send(reply.success("Sent requests fetched", final_data));
    } catch (err) {
        return res.send(reply.failed("Err: " + err.message))
    }
}

const received_requests = async (req, res) => {
    try {
        let { name, page, per_page } = req.query;
        const sent_requests = await Friendship.findAll({
            where: {
                receiver_id: req.user.id,
                is_confirmed: 0
            },
            attributes: ['id', 'sender_id'],
            raw: true
        })

        const filtered_requests = sent_requests.map((user) => { return user.sender_id });

        var condition = {
            where: {
                id: { [Op.in]: filtered_requests }
            },
            attributes: ['id', 'name', 'email', 'state_id', 'country_id', 'status', 'image'],
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
        };
        if (name) {
            condition.where.name = { [Op.substring]: name };
        }
        const final_data = await reply.paginate(User, page, per_page, condition)
        return res.send(reply.success("Sent requests fetched", final_data));
    } catch (err) {
        return res.send(reply.failed("Err: " + err.message))
    }
}
const add = async (req, res) => {
    try {
        let { id } = req.params;
        let user = await User.findByPk(id);
        if (!user) {
            return res.send(reply.failed("This account does not exist"))
        }
        let data = {
            sender_id: req.user.id,
            receiver_id: id
        }
        let sent = await Friendship.findOne({
            where: {
                [Op.or]: [{ sender_id: data.sender_id, receiver_id: data.receiver_id }, { sender_id: data.receiver_id, receiver_id: data.sender_id }]
            }
        });
        if (sent) {
            return res.send(reply.failed('Request already sent'))
        }
        await Friendship.create(data);
        return res.send(reply.success('Request sent'))
    } catch (err) {
        return res.send(reply.failed("Err: " + err.message))
    }
}
const cancel_request = async (req, res) => {
    try {
        let { id } = req.params;
        let user = await User.findByPk(id);
        if (!user) {
            return res.send(reply.failed("This account does not exist"))
        }
        let data = {
            sender_id: req.user.id,
            receiver_id: id
        }
        let sent = await Friendship.findOne({
            where: {
                [Op.or]: [{ sender_id: data.sender_id, receiver_id: data.receiver_id }, { sender_id: data.receiver_id, receiver_id: data.sender_id }]
            }
        });
        if (!sent) {
            return res.send(reply.failed('No relation found'))
        }
        await Friendship.destroy({
            where: {
                id: sent.id
            }
        });
        return res.send(reply.success('Request cancelled'))
    } catch (err) {
        return res.send(reply.failed("Err: " + err.message))
    }
}
const confirm_request = async (req, res) => {
    try {
        let { id } = req.params;
        let user = await User.findByPk(id);
        if (!user) {
            return res.send(reply.failed("This account does not exist"))
        }
        let data = {
            sender_id: req.user.id,
            receiver_id: id
        }
        let sent = await Friendship.findOne({
            where: {
                sender_id: data.receiver_id,
                receiver_id: data.sender_id
            }
        });
        if (!sent) {
            return res.send(reply.failed('No relation found'))
        }
        if (sent.is_confirmed == 1) {
            return res.send(reply.failed('Already friends'))
        }
        await Friendship.update({ is_confirmed: 1 }, {
            where: {
                id: sent.id
            }
        });
        return res.send(reply.success('Request accepted'))
    } catch (err) {
        return res.send(reply.failed("Err: " + err.message))
    }
}

const my_friends = async (req, res) => {
    try {
        let { name, page, per_page } = req.query;
        const sent_requests = await Friendship.findAll({
            where: {
                sender_id: req.user.id,
                is_confirmed: 1
            },
            attributes: ['id', 'receiver_id'],
            raw: true
        })

        const received_requests = await Friendship.findAll({
            where: {
                receiver_id: req.user.id,
                is_confirmed: 1
            },
            attributes: ['id', 'sender_id'],
            raw: true
        })
        const filtered_sent = sent_requests.map((user) => { return user.receiver_id });
        const filtered_received = received_requests.map((user) => { return user.sender_id });
        var filtered_requests = [...filtered_sent, ...filtered_received];


        var condition = {
            where: {
                id: { [Op.in]: filtered_requests }
            },
            attributes: ['id', 'name', 'email', 'state_id', 'country_id', 'status', 'image'],
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
        };
        if (name) {
            condition.where.name = { [Op.substring]: name };
        }
        const final_data = await reply.paginate(User, page, per_page, condition)
        return res.send(reply.success("Sent requests fetched", final_data));
    } catch (err) {
        return res.send(reply.failed("Err: " + err.message))
    }
}
export default {
    find,
    add,
    sent_requests,
    received_requests,
    cancel_request,
    confirm_request,
    my_friends
}