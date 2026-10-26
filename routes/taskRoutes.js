const express = require('express');
const router = express.Router();
const validateTask = require('../middlewares/validateTask');
const {
  getAllTasks,
  searchTasks,
  getTasksByAssignee,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

// /tasks rotaları
router.get('/', getAllTasks);
router.get('/search', searchTasks);
router.get('/assignee/:name', getTasksByAssignee);
router.get('/:id', getTaskById);
router.post('/', validateTask, createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
