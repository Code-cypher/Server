import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import fs from 'fs';

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, {
        expiresIn: maxAge
    })
}

// Register a new user
export const signup = async (request, response, next) => {

    try {
        const { email, password } = request.body;
        // Check if the user already exists
        if (!email || !password) {
            return res.status(400).send("Email and password is requireed.");
        }

        const user = await User.create({ email, password })
        response.cookie('jwt', createToken(email, user.id), { maxAge: maxAge, secure: true, sameSite: "None" });
        return response.status(201).json({ user: { id: user.id, email: user.email, profileSetup: user.profileSetup } });
    } catch (error) {
        return response.status(500).json({ message: 'Server error', error });
    }
}

// Login a user
export const login = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).send("Email and Password is required.");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(404).send("USer with the given email not found.");
        }
        const auth = await compare(password, user.password);
        if (!auth) {
            return response.status(400).send("Password is incorrect.");
        }
        response.cookie('jwt', createToken(email, user.id), { maxAge: maxAge, secure: true, sameSite: "None" });
        return response.status(200).json({ user: { id: user.id, email: user.email, profileSetup: user.profileSetup, firstName: user.firstName, lastName : user.lastName,image : user.image, color : user.color }, });
    } catch (error) {
        return response.status(500).send("Internal server Error");
    }
}

// Get user info
export const getUserInfo = async (request, response, next) => {
    try {
        const userData = await User.findById(request.userId);
        if (!userData) {
            return response.status(404).json({ message: 'User with the given id not found.' });
        }
        return response.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Server Error' });
    }
}

// Update user profile
export const updateProfile = async (request, response, next) => {
    try {
        const { userId } = request;
        const { firstName, lastName, color } = request.body;
        if (!firstName || !lastName) {
            return response.status(400).send("FirstNAme lastname and color is required.");
        }

        const userData = await User.findByIdAndUpdate(userId, { firstName, lastName, color, profileSetup:true }, { new: true, runValidators: true });
        return response.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Server Error' });
    }
}

// Add profile image
export const addProfileImage = async (request, response, next) => {
    try {
        // const { userId } = request;
        // const { image, } = request.body;
        if (!request.file) {
            return response.status(400).json({ message: 'FIle is required.' });
        }

        const date = Date.now();
        let fileName = "uploads/profiles/" + date + request.file.originalname;
        fs.renameSync(request.file.path, fileName);
        const updatedUser = await User.findByIdAndUpdate(request.userId, { image: fileName }, { new: true, runValidators: true });
        return response.status(200).json({
            id: updatedUser.id,
            image: updatedUser.image
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Server Error' });
    }
}

// Remove profile image
export const removeProfileImage = async (request, response, next) => {
    try {
        const { userId } = request;
        const user = await User.findById(userId);
        const userData = await User.findById(userId)

        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }

        if (user.image) {
            fs.unlinkSync(user.image);
        }

        user.image = null
        await user.save();

        return response.status(200).send("Profile image removed succesfully.");
    } catch (error) {
        console.error(error);
        return response.status(500).send({ message: 'Server Error' });
    }
}

// Logout a user
export const logout = async (request, response, next) => {
    try {
        response.clearCookie('jwt', "", { maxAge: 1, secure: true, sameSite: "None" });
        return response.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        return response.status(500).json({ message: 'Server error', error });
    }
}