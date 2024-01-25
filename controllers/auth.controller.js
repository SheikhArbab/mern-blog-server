import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/users.model.js';


export const i = async (req, res, next) => {
    res.json({ message: "from blogger" })
}





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
    try {
        const { email, password } = req.body;

        // Find the user with the provided email
        const user = await User.findOne({ email });

        // If the user does not exist, return an error
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials', success: false });
        }

        const { password: userPassword, ...userWithoutPassword } = user._doc;



        // Check if the provided password matches the stored password
        const isPasswordValid = await bcrypt.compare(password, userPassword);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials', success: false });
        }

        // Generate a JWT token for the authenticated user
        const token = jwt.sign(
            { payload: userWithoutPassword, userId: user._id, email: user.email, isAdmin: user.IsAdmin },
            process.env.JWT_SECRET_KEY,

            { expiresIn: '1d' }
        );

        // Send the token in the response and set it as a secure, httpOnly cookie
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' })
            .status(200)
            .json({ message: 'Login successfully', success: true, payload: userWithoutPassword, token });

    } catch (error) {
        next(error);
    }
};

const handleSocialAuthentication = async (req, res, next) => {
    const { username, email, avatar } = req.body;


    try {
        const socialUser = await User.findOne({ email });

        if (socialUser) {
            const { password: _, ...rest } = socialUser._doc;

            const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
            const token = jwt.sign(
                { payload: rest, userId: rest._id, email: socialUser.email, isAdmin: socialUser.IsAdmin },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1d' }
            );

            res.cookie('token', token, { httpOnly: true, expires: expirationDate }).status(200).json({ payload: rest, token });
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
            const token = jwt.sign(
                { userId: newUser._id, email: newUser.email, isAdmin: newUser.IsAdmin },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1d' }
            );

            const { password: _, ...newUserRest } = newUser._doc;

            res.cookie('token', token, { httpOnly: true, expires: expirationDate }).status(200).json(newUserRest);
        }
    } catch (error) {
        next(error);
    }

};


export const google = async (req, res, next) => {
    handleSocialAuthentication(req, res, next, 'google');
};