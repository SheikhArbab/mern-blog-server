import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/users.model.js';

export const signUp = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully!', success: true });
    } catch (error) {
        next(error);
    }
};




export const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Find the user with the provided email
        const user = await User.findOne({ email });

        // If the user does not exist, return an error
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials', success: false });
        }

        const { password: pass, ...rest } = user._doc;

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // If the password is not valid, return an error
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials', success: false });
        }

        // Generate a JWT token for the authenticated user
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        // Send the token in the response and set it as a secure, httpOnly cookie
        res.cookie('token', token).status(200).json({ message: 'Login successfully', success: true, user: rest, token });

    } catch (error) {
        next(error);
    }
};



const handleSocialAuthentication = async (req, res, next) => {
    const { username, email, avatar } = req.body;
 

    try {
        const socialUser = await User.findOne({ email });

        if (socialUser) {
            const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
            const token = jwt.sign({ id: socialUser._id, exp: expirationDate.getTime() / 1000, payload: socialUser }, process.env.JWT_SECRET_KEY);

            const { password: _, ...rest } = socialUser._doc;

            res.cookie('token', token, { httpOnly: true, expires: expirationDate }).status(200).json({ user: rest, token });
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                profilePicture: avatar,
            });

            await newUser.save();

            const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
            const token = jwt.sign({ id: newUser._id, exp: expirationDate.getTime() / 1000 }, process.env.JWT_SECRET_KEY);

            const { password: _, ...rest } = newUser._doc;

            res.cookie('token', token, { httpOnly: true, expires: expirationDate }).status(200).json(rest);
        }
    } catch (error) {
        next(error);
    }
};


export const google = async (req, res, next) => {
    handleSocialAuthentication(req, res, next, 'google');
};