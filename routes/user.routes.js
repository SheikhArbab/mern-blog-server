import express from "express";
import { updateUser,deleteUser,getUsers,getUserById } from '../controllers/user.controller.js';
import { isAuthenticated, isAuthorized } from '../middlewares/authHandler.js'


const userRouter = express.Router();


userRouter.route("/update/:userId").put(isAuthenticated, isAuthorized(), updateUser);
userRouter.route("/getusers").get(isAuthenticated, isAuthorized(), getUsers);
userRouter.route("/delete/:userId").delete(isAuthenticated, isAuthorized(), deleteUser);
userRouter.route("/getusers/:userId").get(getUserById);

export default userRouter;