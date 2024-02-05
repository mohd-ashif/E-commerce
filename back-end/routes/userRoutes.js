import express from "express";
import User from "../model/userModel.js";
import bcrypt from 'bcryptjs'
import { generateToken } from "../ustils.js";
import expressAsyncHandler from 'express-async-handler'

const userRouter = express.Router();

userRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
  
    if (user && bcrypt.compareSync(password, user.password)) {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
    } else {
      res.status(401).send({ message: 'Invalid email or password' });
    }
  }));
  
  userRouter.post(
    '/signup',
    expressAsyncHandler(async (req, res) => {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
      });
      const user = await newUser.save();
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
    })
  );
  
  
export default userRouter;