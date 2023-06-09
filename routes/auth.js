const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");

// REGISTER
router.post("/register", async (req, res) => {
  // Validating Data
  const { error } = registerValidation(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  //Checking if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(404).send("Email already Exist");

  //Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Create a new user
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.status(201).send({ status: 201, user: user.id, user: savedUser });
  } catch (err) {
    res.status(400).send(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  // Validating Data
  const { error } = loginValidation(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  //Checking if the user is already in the database
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send("Email does not Exist");

  //Password is Correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid Password");

  //Create and assign a token
  const token = jwt.sign({ _id: user._id }, "THISISASECRET");
  res
    .header("auth-token", token)
    .status(200)
    .send({
      token: token,
      status: 200,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  // res.send('Logged In');
});

module.exports = router;
