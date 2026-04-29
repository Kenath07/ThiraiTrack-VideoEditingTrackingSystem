const express = require('express');
const router = express.Router();
const { getUsers, getTeamMembers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getUsers);
router.get('/team', getTeamMembers);

module.exports = router;
