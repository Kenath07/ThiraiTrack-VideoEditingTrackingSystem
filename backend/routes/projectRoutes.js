const express = require('express');
const router = express.Router();
const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', getProjects);
router.post('/', authorizeRoles('Project Manager', 'Video Editing Head'), createProject);

router.get('/:id', getProjectById);
router.put('/:id', authorizeRoles('Project Manager', 'Video Editing Head'), updateProject);
router.delete('/:id', authorizeRoles('Project Manager', 'Video Editing Head'), deleteProject);

module.exports = router;
