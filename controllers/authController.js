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
        const accessToken = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        newUser.refreshToken = refreshToken;
        await newUser.save();
        res.status(201).json({ result: newUser, accessToken, refreshToken });// {token, user: {email: newUser.email, id: newUser._id}});
    }catch (error) {
        res.status(500).json({ message: 'Signup failed', error: error.message });
    }
};

const signIn = async (req, res) => {
    const { email, password } = req.body;
    console.log('SIGNIN PAYLOAD:', req.body);
    try {
       const existingUser = await User.findOne({ email}).select('+password');
       if (!existingUser) return res.status(404).json({ message: 'User not found' });

       const isPasswordValid = await bcrypt.compare(password, existingUser.password);
       if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

       const accessToken = jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
       const refreshToken = jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
       existingUser.refreshToken = refreshToken;
       await existingUser.save();

       const userWithoutPassword = existingUser.toObject();
       delete userWithoutPassword.password;
       res.status(200).json({ result: userWithoutPassword, accessToken, refreshToken });// {token, user: {email: existingUser.email, id: existingUser._id}});
    } catch (error) {
        res.status(500).json({ message: 'Signin failed', error: error.message });
    }
};

const logOut = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if ( !refreshToken) return res.status(400).jsoon({ message: 'Refresh token is required' });
        const user = await User.find({ refreshToken });
        if (!user) return res.status(404).json({ message: 'User not found'});
        user.refreshToken = null; // Clear the refresh token
        await user.save();
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Logout failed', error: error.message });
    }
};

const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token is required' });
    try{
        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(403).json({ message: 'Invalid refresh token' });

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err){
                return res.status(403).json({message: 'Invalid or expired refresh token'});
            }else {
                const accessToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
                res.status(200).json({ accessToken });
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'Failed to refresh access token', error: error.message });
    };
};

module.exports = { signUp , signIn, logOut, refreshAccessToken };