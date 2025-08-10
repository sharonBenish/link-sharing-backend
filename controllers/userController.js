const User = require('../models/users');

const editProfile = async (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName, profileImage } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, profileImage },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ result: updatedUser._id });
    } catch (error) {
        res.status(500).json({ message: 'Profile update failed', error: error.message });
    }
}

module.exports = { editProfile };