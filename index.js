import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { userRoutes, authRoutes } from './routes/index.routes.js';
import { connectDB } from './config/config.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
dotenv.config();
connectDB();

app.use(bodyParser.json({ limit: '1gb' }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'https://mern-blogger.netlify.app' }));

app.use("/", express.static('public'), express.static('public'), userRoutes, authRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => console.log(`Server: ${process.env.PORT}`));
