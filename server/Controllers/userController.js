const userModel = require("../Models/userModel");
const brcypt = require("bcrypt");
var validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET;
  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await userModel.findOne({ email });
    if (user) return res.status(400).json("User already exists");
    if (!name || !email || !password)
      return res.status(400).json("Please fill all the fields");
    if (!validator.isEmail(email)) return (400).json("Invalid Email");
    if (password.length < 6)
      return res
        .status(400)
        .json("Password should be atleast 6 characters long");

    user = new userModel({
      name,
      email,
      password,
    });

    // Hash password
    const salt = await brcypt.genSalt(10);
    user.password = await brcypt.hash(user.password, salt);

    await user.save();

    // Create token
    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user =  await userModel.findOne({ email });
    if (!user) return res.status(400).json("Invalid email or password...");

    const isValidPassword = await brcypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(400).json("Invalid email or password...");

    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name:user.name, email, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};


const findUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user  = await userModel.findById(userId);
        res.status(200).json(user);
    } catch (error) {
        console.log(error)
    }
}


const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }    
}


module.exports = { registerUser, loginUser, findUser, getUsers };
