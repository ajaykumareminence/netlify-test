import express from "express";
import FriendController from "../controllers/FriendController.js";
import Authenticate from "../middleware/Authenticate.js";

const router = express.Router();
router.get('/find', Authenticate, FriendController.find);
router.get('/sent_requests', Authenticate, FriendController.sent_requests);
router.get('/received_requests', Authenticate, FriendController.received_requests);
router.put('/add/:id', Authenticate, FriendController.add);
router.put('/cancel_request/:id', Authenticate, FriendController.cancel_request);
router.put('/confirm_request/:id', Authenticate, FriendController.confirm_request);
router.get('/my_friends', Authenticate, FriendController.my_friends);


export const FriendRoutes = router;