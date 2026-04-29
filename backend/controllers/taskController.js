const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, project, deadline, priority } = req.body;

        if (!title || !description || !assignedTo || !project || !deadline) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const task = await Task.create({
            title,
            description,
            assignedTo,
            project,
            deadline,
            priority: priority || 'Medium',
            createdBy: req.user._id
        });

        const populatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'fullName name email role')
            .populate('project', 'title');

        res.status(201).json(populatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Implement task management API endpoints
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('assignedTo', 'fullName name email role')
            .populate('project', 'title')
            .populate('createdBy', 'fullName name email role')
            .populate('comments.user', 'fullName name role');
            
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id })
            .populate('assignedTo', 'fullName name email role')
            .populate('project', 'title')
            .populate('createdBy', 'fullName name email role')
            .populate('comments.user', 'fullName name role');
            
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'fullName name email role')
            .populate('project', 'title status')
            .populate('createdBy', 'fullName name email role')
            .populate('comments.user', 'fullName name role');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const { title, description, assignedTo, project, deadline, priority, status } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, assignedTo, project, deadline, priority, status },
            { new: true, runValidators: true }
        ).populate('assignedTo', 'fullName name email role')
         .populate('project', 'title')
         .populate('comments.user', 'fullName name role');

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Basic permission check - this could be expanded
        if (req.user.role === 'Video Editing Intern' && !['Pending', 'In Progress', 'Under Review'].includes(status)) {
             return res.status(403).json({ message: 'Interns cannot change status to Completed or Rejected' });
        }

        task.status = status;
        await task.save();

        const updatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'fullName name email role')
            .populate('project', 'title')
            .populate('comments.user', 'fullName name role');

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addTaskComment = async (req, res) => {
    try {
        const { text, driveLink } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (text) {
            const comment = {
                user: req.user._id,
                text
            };
            task.comments.push(comment);
        }

        if (driveLink !== undefined) {
            task.driveLink = driveLink;
        }

        await task.save();

        const updatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'fullName name email role')
            .populate('project', 'title')
            .populate('comments.user', 'fullName name role');

        res.status(201).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.deleteOne();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
