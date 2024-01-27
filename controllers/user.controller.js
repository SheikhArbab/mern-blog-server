import User from '../models/users.model.js';
import bcrypt from 'bcrypt';
import { imageUploading } from '../utils/utils.js';


export const updateUser = async (req, res, next) => {

    let { username, email, profilePicture, password } = req.body;
    const { userId } = req.params;

    try {
        // Find the user by ID
        const userToUpdate = await User.findById(userId);

        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        userToUpdate.username = username || userToUpdate.username;
        userToUpdate.email = email || userToUpdate.email;


        // Check if a new profilePicture is provided
        if (profilePicture) {
            try {
                const fileName = await imageUploading({ image: profilePicture, folder: 'user' });

                userToUpdate.profilePicture = fileName;

            } catch (uploadError) {
                res.json({ message: 'Error uploading image:', uploadError, success: false });
            }
        }


        // Check if a new password is provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            userToUpdate.password = hashedPassword;
        }

        // Save the updated user
        const updatedUser = await userToUpdate.save();

        const { password: _, ...rest } = updatedUser._doc;

        res.json({
            updatedUser: rest,
            success: true,
            message: `The user ${updatedUser.username} has been successfully updated.`,
        });
    } catch (error) {
        next(error);
    }
};


export const deleteUser = async (req, res, next) => {

    const { userId } = req.params;

    try {

        // Find and delete the post
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        res.status(200).json({ deletedUser, message: 'User deleted successfully', success: true });
    } catch (error) {
        next(error);
    }
};

