import express from "express";
import StaticController from "../controllers/StaticController.js";

const router = express.Router();
router.get('/region', StaticController.region)

export const StaticRoutes = router;