const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendSuccess, sendError } = require("../utils/response");
const {userModel,customerModel}=require("../models/index")

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

async function signUpOrCreateUser(req, res) {
  try {
    const { email, password,name } = req.body;

    if (!email || !password) {
      return sendError(res, 400, {
        error: "Email, password, and role are required",
      });
    }

    const existingUser = await userModel.findOne({ where: { email } });

    if (existingUser) {
      return sendError(res, 400, {
        error: `User already exists with email: ${email}`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const cart = await newUser.createCart()
    newUser.cartId = cart.id
    await newUser.save()
    
    return sendSuccess(
      res,
      {
        message: "User created successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
        },
      },
      201
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return sendError(res, 500, { error: "Internal server error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, { error: "Email and password are required" });
    }

    const user = await userModel
      .scope("withPassword")
      .findOne({ where: { email } });

    if (!user) {
      return sendError(res, 404, { error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return sendError(res, 401, { error: "Incorrect password" });
    }

    const tokenPayload = { id: user.id, role: user.role };
    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return sendSuccess(res, {
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return sendError(res, 500, { error: "Internal server error" });
  }
}

async function findAllUsers(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    if (pageNumber <= 0 || pageLimit <= 0) {
      return sendError(res, 400, "Page and limit must be positive integers");
    }

    const offset = (pageNumber - 1) * pageLimit;

    const { count, rows } = await userModel.findAndCountAll({
      limit: pageLimit,
      offset: offset,
    });

    const totalPages = Math.ceil(count / pageLimit);

    return sendSuccess(res, {
      users: rows,
      pagination: {
        totalCount: count,
        totalPages: totalPages,
        currentPage: pageNumber,
        pageSize: pageLimit,
      },
    });
  } catch (error) {
    return sendError(res, 500, error.message || "Internal server error");
  }
}


module.exports = {
  signUpOrCreateUser,
  login,
  findAllUsers
};
