import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const sendAuthResponse = (res, user, statusCode = 200) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) throw new AppError('Name, email, and password are required', 400);

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError('Email is already registered', 409);

  const user = await User.create({ name, email, password, role });
  sendAuthResponse(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError('Email and password are required', 400);

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  sendAuthResponse(res, user);
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
