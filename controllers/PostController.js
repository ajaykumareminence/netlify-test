import reply from "../common/reply.js";
import { Post } from "../models/Post.js";
import Validation from "../common/CustomValidation.js";
import { User } from "../models/User.js";
import { Like } from "../models/Like.js";
import { Comment } from "../models/Comment.js";
const create = async (req, res) => {
    try {
        let request = req.body;
        let { status, message } = await Validation(request, {
            description: 'max:200',
        })
        if (!status) {
            return res.send(reply.failed(message))
        }
        var image = [];
        if (req.files?.length > 0) {
            for (const v of req.files) {
                image.push(v.filename)
            }
        }
        const data = {
            user_id: req.user.id,
            description: request.description,
            image: JSON.stringify(image)
        }
        await Post.create(data);
        return res.send(reply.success('Post added'))
    } catch (err) {
        return res.send(reply.failed("Err: " + err.message))
    }
}
const get = async (req, res) => {
    try {
        let posts = await Post.findAll({
            order: [['id', 'desc']],
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'image']
                },
                {
                    model: Like,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'email', 'image']
                        }
                    ]
                }
            ]
        })
        return res.send(reply.success('Posts fetched', posts))
    } catch (err) {
        return res.send(reply.failed("Err: " + err.message))
    }
}
const doLike = async (req, res) => {
    try {
        let { id } = req.params;
        // let { status } = req.query;
        // let validate = await Validation(request, {
        //     status: 'required|in:1,0',
        // })
        // if (!validate.status) {
        //     return res.send(reply.failed(validate.message))
        // }
        let post = await Post.findByPk(id);
        if (!post) {
            return res.send(reply.failed("Post does not exist"))
        }
        let data = {
            post_id: post.id,
            user_id: req.user.id
        }
        let isLiked = await Like.findOne({
            where: data
        })
        if (isLiked) {
            await Like.destroy({
                where: {
                    id: isLiked.id
                }
            })
            return res.send(reply.success('Unliked successfully'))
        } else {
            await Like.create(data)
            return res.send(reply.success('Liked successfully'))
        }
    } catch (err) {
        return res.send(reply.failed("Err: " + err.message))
    }
}

const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        let post = await Post.findOne({
            where: {
                id: id
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'image']
                },
                {
                    model: Like,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'email', 'image']
                        }
                    ],

                },
                {
                    model: Comment,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'email', 'image']
                        }
                    ]
                }
            ]
        })
        return res.send(reply.success('Post fetched', post))
    } catch (err) {
        return res.send(reply.failed("Err: " + err.message))
    }
}
const comment = async (req, res) => {
    try {
        let { id } = req.params;
        let request = req.body;
        let { status, message } = await Validation(request, {
            comment: 'required|max:50',
        })
        if (!status) {
            return res.send(reply.failed(message))
        }
        let post = await Post.findOne({
            where: {
                id
            }
        });
        if (!post) {
            return res.send(reply.failed('This post does not exist'))
        }
        await Comment.create({
            post_id: id,
            user_id: req.user.id,
            comment: request.comment
        });
        return res.send(reply.success('Comment added'))
    } catch (err) {
        return res.send(reply.failed("Err: " + err.message))
    }
}
const removeComment = async(req,res) => {
    try {
        let request = req.query;
        let { status, message } = await Validation(request, {
            post_id: 'required',
            comment_id: 'required'
        })
        if (!status) {
            return res.send(reply.failed(message))
        }
        let post = await Post.findOne({
            where: {
                id: request.post_id
            }
        });
        if (!post) {
            return res.send(reply.failed('This post does not exist'))
        }
        let comment = await Comment.findOne({
            where:{
                id: request.comment_id,
                user_id: req.user.id,
                post_id: post.id
            }
        })
        if(!comment){
            return res.send(reply.failed('Comment not found..Refresh may fix!!'))
        }
        await Comment.destroy({
            where:{
                id: comment.id
            }
        });
        return res.send(reply.success('Comment deleted'))
    } catch (err) {
        return res.send(reply.failed("Err: " + err.message))
    }
}

export default {
    create,
    get,
    doLike,
    getOne,
    comment,
    removeComment
}