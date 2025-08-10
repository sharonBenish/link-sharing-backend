const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const signUp = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({email});
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ ...req.body, password: hashedPassword });
        await newUser.save();
        // Creat jwt token
        const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '3h' });
        res.status(201).json({ result: newUser, token });// {token, user: {email: newUser.email, id: newUser._id}});
    }catch (error) {
        res.status(500).json({ message: 'Signup failed', error: error.message });
    }
}

const signIn = async (req, res) => {
    const { email, password } = req.body;
    console.log('SIGNIN PAYLOAD:', req.body);
    try {
       const existingUser = await User.findOne({ email}).select('+password');
       if (!existingUser) return res.status(404).json({ message: 'User not found' });

       const isPasswordValid = await bcrypt.compare(password, existingUser.password);
       if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

       const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
       const userWithoutPassword = existingUser.toObject();
       delete userWithoutPassword.password;
       res.status(200).json({ result: userWithoutPassword, token });// {token, user: {email: existingUser.email, id: existingUser._id}});
    } catch (error) {
        res.status(500).json({ message: 'Signin failed', error: error.message });
    }
}

module.exports = { signUp , signIn }