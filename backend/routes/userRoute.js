import { Router } from "express";
import {
  loginUser,
  registerUser,
  listUsers,
  removeUser,
  profileInfo,
  updateProfile,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const userRoute = Router();

// register user / create user
userRoute.post("/register", registerUser);
// login
userRoute.post("/login", loginUser);
// get list of users
userRoute.get("/list", listUsers);
// remove user - delete
userRoute.post("/remove", removeUser);
// get user profile
userRoute.get("/settings", authMiddleware, profileInfo);
// update profile info
userRoute.put("/update", authMiddleware, updateProfile);

export default userRoute;
