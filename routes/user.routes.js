import express from "express"; 
import { updateUser } from '../controllers/user.controller.js'; 
import { verifyToken } from '../utils/verifyUser.js';
import {isAuthenticated,isAuthorized} from '../middlewares/authHandler.js'


const userRouter = express.Router();
 

userRouter.route("/update/:userId").put(verifyToken,isAuthenticated,updateUser); 

export default userRouter;