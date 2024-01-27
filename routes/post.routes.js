import express from "express"; 
import {getPosts, createPost, deletePost,getPostById,updatePost } from '../controllers/post.controller.js';  
import {isAuthenticated,isAuthorized} from '../middlewares/authHandler.js'


const postRouter = express.Router();
 

postRouter.route("/create/post").post(isAuthenticated,isAuthorized(),createPost); 
postRouter.route("/update/post/:id").put(isAuthenticated,isAuthorized(),updatePost); 
postRouter.route("/delete/post/:id").delete(isAuthenticated,isAuthorized(),deletePost); 
postRouter.route("/get/posts").get(getPosts); 
postRouter.route("/get/post/:id").get(getPostById); 

export default postRouter;