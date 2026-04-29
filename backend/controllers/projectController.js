const Project = require('../models/Project');

exports.createProject = async (req, res) => {
    try {
        const { title, description, deadline, status } = req.body;

        if (!title || !description || !deadline) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const project = await Project.create({
            title,
            description,
            deadline,
            status: status || 'Planning',
            createdBy: req.user._id
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('createdBy', 'fullName email role');
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('createdBy', 'fullName email role');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const { title, description, deadline, status } = req.body;

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { title, description, deadline, status },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await project.deleteOne();

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
