import { Router } from 'express';
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getUserInfo, login, signup, updateProfile,  addProfileImage, removeProfileImage, logout } from "../controllers/AuthController.js";
import multer from 'multer';

const AuthRouter = Router();
const upload = multer({ dest: 'uploads/profiles/' });

// Register route
AuthRouter.post('/signup', signup);

// Login route
AuthRouter.post('/login', login);

// user info
AuthRouter.post('/user-info',verifyToken ,getUserInfo)

// update route
AuthRouter.post('/update-profile', verifyToken, updateProfile);

// add profile image
AuthRouter.post('/add-profile-image', verifyToken, upload.single("profile-image"),addProfileImage);

//remove image
AuthRouter.delete('/remove-profile-image', verifyToken, removeProfileImage);

//logout route
AuthRouter.post('/logout',logout);


export default AuthRouter;