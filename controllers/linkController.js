const Link = require('../models/links');

const addLinks = async (req, res) => {
    const links = req.body;
    const userId = req.user.id;

    if (!Array.isArray(links) || links.length === 0) {
        return res.status(400).json({ message: 'Invalid links format. Expected an array of links.' });
    }
    try {
        await Link.deleteMany({ userId });
        const newLinks = links.map((link, index) => ({ 
            ...link,
            userId: userId,
            order: link.order || index // Default order to 0 if not provided
         }));
        const savedLinks = await Link.insertMany(newLinks);
        res.status(201).json({ result: savedLinks });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add links', error: error.message });
    }
};

const getLinks = async (req, res) => {
    // const { userId } = req.params;
    // if (!userId) {
    //     return res.status(400).json({ message: 'User ID is required' });
    // }
    try {
        const userId = req.user.id; // Get userId from authenticated user
        if (req.user.id !== userId) return res.status(403).json({ message: "You can only access your own links" });
        const links = await Link.find({ userId }).sort({ order: 1 });
        res.status(200).json({ result: links });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve links', error: error.message });
    }
};

module.exports = { addLinks, getLinks };