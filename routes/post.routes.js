import express from "express"; 
import {getPosts, createPost } from '../controllers/post.controller.js';  
import {isAuthenticated,isAuthorized} from '../middlewares/authHandler.js'


const postRouter = express.Router();
 

postRouter.route("/create/post").post(isAuthenticated,isAuthorized(),createPost); 
postRouter.route("/get/posts").get(getPosts); 

export default postRouter;