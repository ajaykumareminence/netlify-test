import express from "express";
import PostController from "../controllers/PostController.js";
import Authenticate from "../middleware/Authenticate.js";
import { handleMultiUpload } from "../common/ImageUpload.js";

const router = express.Router();
router.post('/create', Authenticate, handleMultiUpload, PostController.create);
router.get('/get', Authenticate, PostController.get);
router.put('/doLike/:id', Authenticate, PostController.doLike);
router.get('/getOne/:id', Authenticate, PostController.getOne);
router.post('/comment/:id', Authenticate, PostController.comment);
router.delete('/removeComment', Authenticate, PostController.removeComment);

export const PostRoutes = router;