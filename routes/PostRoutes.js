import express from "express";
import PostController from "../controllers/PostController.js";
import Authenticate from "../middleware/Authenticate.js";
import { handleMultiUpload } from "../common/ImageUpload.js";

const router = express.Router();
router.post('/create', Authenticate, handleMultiUpload, PostController.create);
router.get('/get', Authenticate, PostController.get);
router.post('/doLike/:id', Authenticate, PostController.doLike);

export const PostRoutes = router;