const { registerSchema, loginSchema } = require("../validators/auth-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("../models/prisma");
const createError = require("../utils/create-error");

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    console.log(value.password);

    value.password = await bcrypt.hash(value.password, 12);

    const user = await prisma.user.create({
      data: value,
    });

    const payload = { userId: user.id };
    console.log(payload);

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "1q2w3e4r5t6y7u8i9o",
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
    delete user.password;

    res.status(201).json({ accessToken, user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const user = await prisma.user.findUnique({
      where: {
        email: value.email,
      },
    });

    if (!user) {
      return next(createError("invalid credential", 400));
    }

    const isMatch = await bcrypt.compare(value.password, user.password);

    if (!isMatch) {
      return next(createError("wrong password", 400));
    }

    const payload = { userId: user.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "asddddflgkjgjgj",
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
    delete user.password;
    res.status(200).json({ accessToken, user });
  } catch (err) {
    next(err);
  }
};

exports.getMe = (req, res) => {
  res.status(200).json({ user: req.user });
};
