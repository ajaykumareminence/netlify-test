import express from "express";
const app = express();

import { StaticRoutes } from "./StaticRoutes.js";
app.use('/get', StaticRoutes);

import { UserRoutes } from "./UserRoutes.js";
app.use('/user', UserRoutes);

import { FriendRoutes } from "./FriendRoutes.js";
app.use('/friends', FriendRoutes);

export const BaseRoutes = app;