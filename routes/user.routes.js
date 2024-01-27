import express from "express";
import { updateUser,deleteUser } from '../controllers/user.controller.js';
import { isAuthenticated, isAuthorized } from '../middlewares/authHandler.js'


const userRouter = express.Router();


userRouter.route("/update/:userId").put(isAuthenticated, isAuthorized(), updateUser);
userRouter.route("/delete/:userId").delete(isAuthenticated, isAuthorized(), deleteUser);

export default userRouter;