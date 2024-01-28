import express from "express"; 
import { isAuthenticated } from '../middlewares/authHandler.js'
import { newComment,getComment } from '../controllers/comment.controller.js'

const commentRouter = express.Router();
 
commentRouter.route("/new/comment").post(isAuthenticated,newComment);
commentRouter.route("/get/comments/:postId").get(getComment);

export default commentRouter;
