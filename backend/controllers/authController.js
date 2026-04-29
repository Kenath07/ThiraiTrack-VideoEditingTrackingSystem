const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Authentication controller with JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
    try {
        const {
            fullName, email, password, confirmPassword, role, phone, experienceLevel, primarySkill, bio,
            // Role-specific fields
            department, yearsOfExperience, managedProjectsCount, specialization, teamSizeManaged
        } = req.body;

        // Trim all fields
        const trimmedFullName = fullName?.trim();
        const trimmedEmail = email?.trim();
        const trimmedPhone = phone?.trim();
        const trimmedBio = bio?.trim();
        const trimmedDepartment = department?.trim();
        const trimmedSpecialization = specialization?.trim();

        // Validate required fields
        if (!trimmedFullName || !trimmedEmail || !password || !role || !trimmedPhone || !experienceLevel || !primarySkill || !trimmedBio) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Role-specific validation
        if (role === 'Project Manager') {
            if (!trimmedDepartment || !yearsOfExperience || !managedProjectsCount) {
                return res.status(400).json({ message: 'Please fill all Project Manager specific fields' });
            }
        }
        if (role === 'Video Editing Head') {
            if (!trimmedSpecialization || !yearsOfExperience || !teamSizeManaged) {
                return res.status(400).json({ message: 'Please fill all Video Editing Head specific fields' });
            }
        }

        const userExists = await User.findOne({ email: trimmedEmail });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            fullName: trimmedFullName,
            email: trimmedEmail,
            password: hashedPassword,
            role,
            phone: trimmedPhone,
            experienceLevel,
            primarySkill,
            bio: trimmedBio
        };

        // Add role-specific fields if provided
        if (role === 'Project Manager') {
            userData.department = trimmedDepartment;
            userData.yearsOfExperience = parseInt(yearsOfExperience);
            userData.managedProjectsCount = parseInt(managedProjectsCount);
        }
        if (role === 'Video Editing Head') {
            userData.specialization = trimmedSpecialization;
            userData.yearsOfExperience = parseInt(yearsOfExperience);
            userData.teamSizeManaged = parseInt(teamSizeManaged);
        }

        const user = await User.create(userData);

        if (user) {
            res.status(201).json({
                message: 'Registration successful. Please login to continue.',
                _id: user.id,
                name: user.fullName,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.fullName,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
