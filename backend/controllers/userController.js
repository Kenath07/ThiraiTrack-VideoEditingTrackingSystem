const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTeamMembers = async (req, res) => {
    try {
        const teamMembers = await User.find({ 
            role: { $in: ['Video Editing Intern', 'Full-Time Video Editor'] } 
        }).select('-password');
        res.status(200).json(teamMembers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
