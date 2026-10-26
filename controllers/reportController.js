const fs = require('fs');
const path = require('path');

const tasksFilePath = path.join(__dirname, '../data/tasks.json');

// JSON dosyasından görevleri okuyan yardımcı fonksiyon
const readTasks = () => {
  const fileData = fs.readFileSync(tasksFilePath, 'utf8');
  return JSON.parse(fileData);
};

// 1. Tamamlanan görev raporu (GET /reports/completed)
const getCompletedReport = (req, res) => {
  const tasks = readTasks();
  const completedTasks = tasks.filter((item) => item.status === 'completed');

  res.status(200).json({
    success: true,
    completedCount: completedTasks.length,
    data: completedTasks
  });
};

// 2. Bekleyen görev raporu (GET /reports/pending)
const getPendingReport = (req, res) => {
  const tasks = readTasks();
  const pendingTasks = tasks.filter((item) => item.status === 'pending');

  res.status(200).json({
    success: true,
    pendingCount: pendingTasks.length,
    data: pendingTasks
  });
};

// 3. Genel sistem özeti (GET /reports/summary)
const getSummaryReport = (req, res) => {
  const tasks = readTasks();

  const completedCount = tasks.filter((item) => item.status === 'completed').length;
  const inProgressCount = tasks.filter((item) => item.status === 'in-progress').length;
  const pendingCount = tasks.filter((item) => item.status === 'pending').length;

  const highPriorityCount = tasks.filter((item) => item.priority === 'high').length;
  const mediumPriorityCount = tasks.filter((item) => item.priority === 'medium').length;
  const lowPriorityCount = tasks.filter((item) => item.priority === 'low').length;

  res.status(200).json({
    success: true,
    summary: {
      totalTasks: tasks.length,
      byStatus: {
        completed: completedCount,
        inProgress: inProgressCount,
        pending: pendingCount
      },
      byPriority: {
        high: highPriorityCount,
        medium: mediumPriorityCount,
        low: lowPriorityCount
      }
    }
  });
};

module.exports = {
  getCompletedReport,
  getPendingReport,
  getSummaryReport
};
