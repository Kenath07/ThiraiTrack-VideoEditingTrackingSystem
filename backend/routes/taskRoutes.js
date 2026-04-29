const express = require('express');
const router = express.Router();
const {
    createTask,
    getTasks,
    getMyTasks,
    getTaskById,
    updateTask,
    updateTaskStatus,
    addTaskComment,
    deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

//Implement task management API endpoints
router.get('/', getTasks);
router.post('/', authorizeRoles('Video Editing Head'), createTask);

router.get('/my-tasks', getMyTasks);

router.get('/:id', getTaskById);
router.put('/:id', authorizeRoles('Video Editing Head'), updateTask);
router.delete('/:id', authorizeRoles('Video Editing Head'), deleteTask);

router.put('/:id/status', updateTaskStatus);

router.post('/:id/comments', addTaskComment);

module.exports = router;
