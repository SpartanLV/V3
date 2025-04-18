const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { _id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Register request body:", req.body); // Log the incoming request data

    // infer role from email domain
    const domain = email.trim().split('@')[1]?.toLowerCase();
    let role;
    if (domain === 'g.bracu.ac.bd') {
      role = 'student';
    } else if (domain === 'bracu.ac.bd') {
      role = 'faculty';
    } else {
      return res
        .status(400)
        .json({ error: 'Must use a @g.bracu.ac.bd or @bracu.ac.bd email' });
    }

    // prevent duplicate signup
    if (await User.findOne({ email })) {
      console.log("Email already registered:", email); // Log duplicate email check
      return res.status(409).json({ error: 'Email already registered' });
    }

    // create user (password hashing via pre-save hook)
    const user = new User({ name, email, password, role });
    await user.save();

    console.log("Created user:", user); // Log user creation

    // optionally—immediate login response:
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, role: user.role }
    });
  } catch (err) {
    console.error("Registration error:", err); // Log the error
    res.status(500).json({ error: 'Registration failed' });
  }
};


exports.validateToken = (req, res) => {
  res.json({ valid: true, user: req.user });
};
