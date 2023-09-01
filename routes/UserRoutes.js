import express from "express";
import UserController from "../controllers/UserController.js";
import Authenticate from "../middleware/Authenticate.js";
import { handleUpload } from "../common/ImageUpload.js";

const router = express.Router();
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.delete('/logout', Authenticate, UserController.logout);
router.delete('/hardlogout', Authenticate, UserController.hardlogout);
router.get('/activities', Authenticate, UserController.activities);
router.get('/profile', Authenticate, UserController.profile);
router.post('/image-upload', Authenticate, handleUpload, UserController.imageUpload);

export const UserRoutes = router;