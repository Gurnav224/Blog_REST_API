const User = require('../models/user.model');
const jwt = require('jsonwebtoken')
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      res.status(400).json({ error: "all field are required" });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(409).json({ conflict: "user already exist" });
    }

    const user = new User({ username, email, password });

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

    await user.save();
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(201)
      .json({ message: "new user created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "failed to create user" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "all field required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "invalid password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ message: "user login successfully", user });
  } catch (error) {
    console.error("failed to login", error);
    res.status(500).json({ error: "failed to lohin" });
  }
};
