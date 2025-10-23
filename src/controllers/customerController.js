const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendSuccess, sendError } = require("../utils/response");
const {customerModel,userModel,addressModel}=require("../models/index")

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

async function userRegister(req, res) {
  try {
    const { name, email, password, address } = req.body;

    const user = await userModel.findOne({ where: { email } });
    if (user)
      return sendError(res, 400,`User already exists with email: ${email}`,
    );
    const existingUser = await customerModel.findOne({ where: { email } });
    if (existingUser)
      return sendError(res, 400,
        `User already exists with email: ${email}`,
      );

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await customerModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const lat = (address && address.latitude) || 0;
    const lng = (address && address.longitude) || 0;
    await addressModel.create({
      customerId: newUser.id,
      line1: address?.line1 || "",
      city: address?.city || "",
      state: address?.state || "",
      country: address?.country || "",
      postalCode: address?.postalCode || "",
      latitude: lat,
      longitude: lng,
    });

    const cart=await newUser.createCart()
    newUser.cartId=cart.id
    await newUser.save()

    return sendSuccess(
      res,
      { message: "Registered successfully", user: { id: newUser.id, email } },
      201
    );
  } catch (err) {
    return sendError(res, 500, err.message||"Internal server error");
  }
}

async function userLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return sendError(res, 400, { error: "Email and password are required" });

    const user = await customerModel
      .scope("withPassword")
      .findOne({ where: { email } });
    if (!user) return sendError(res, 404, { error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return sendError(res, 401, { error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return sendSuccess(res, {
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return sendError(res, 500, { error: "Internal server error" });
  }
}

async function getUserProfile(req, res) {
  try {
    const customer = req.user;
    const data = await customerModel.findByPk(customer.id, {
      include: [{ model: addressModel, as: "addresses" }],
    });

    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, 500, { error: "Could not fetch profile" });
  }
}

async function updateUserAddress(req, res) {
  try {
    const {
      addressId,
      line1,
      city,
      state,
      country,
      postalCode,
      latitude,
      longitude,
    } = req.body;

    const customerDoc = await customerModel.findByPk(req.user.id);
    if (!customerDoc)
      return sendError(res, 404, { error: "Customer not found" });

    const addressList = await customerDoc.getAddresses({ where: { id: addressId } });
    const address = addressList[0];
    if (!address) return sendError(res, 404, { error: "Address not found" });

    await address.update({
      line1: line1 ?? address.line1,
      city: city ?? address.city,
      state: state ?? address.state,
      country: country ?? address.country,
      postalCode: postalCode ?? address.postalCode,
      latitude: latitude ?? address.latitude,
      longitude: longitude ?? address.longitude,
    });

    return sendSuccess(res, {
      message: "Address updated successfully",
      address,
    });
  } catch (err) {
    return sendError(res, 500, err.message || "Internal server error");
  }
}


module.exports = {
  userRegister,
  userLogin,
  getUserProfile,
  updateUserAddress,
};
