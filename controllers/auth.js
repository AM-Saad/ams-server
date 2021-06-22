const User = require("../models/User");
const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ message: errors.array()[0].msg });
  const { name, email, password } = req.body;

  // const image = req.file.path.replace("\\", "/");
  try {
    // const exsisting = await User.findOne({ email: email });
    // if (exsisting) return res.json(401).json({ message: 'Already subscribed', messageType: 'info' })
    //Check Exsisting of user
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
      // profilePicture: image
    });
    const result = await user.save();
    res.status(201).json({ message: "User Created", userId: result._id });
  } catch (error) {
    if (!error.statusCode) {
      return (error.statusCode = 500);
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(password);

  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: 'Email OR password not correct!' });
    console.log(user);

    const isEqual = await bcrypt.compare(password, user.password);
    console.log(isEqual);
    if (!isEqual) return res.status(404).json({ message: 'Email OR password not correct!' });

    const token = jwt.sign(
      {
        name: user.name,
        id: user._id.toString(),
        image: user.profilePicture
      },
      "SomeSuperAsecretBymy",
      { expiresIn: "9h" }
    );

    req.user = { _id: user._id, name: user.name, }
    req.token = token
    req.isLoggedIn = true;
    return await res.status(200).json({ token: token, user: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong' });
  }
};
