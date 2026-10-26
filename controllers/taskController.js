const fs = require('fs');
const path = require('path');

const tasksFilePath = path.join(__dirname, '../data/tasks.json');

// JSON dosyasından görevleri okuyan yardımcı fonksiyon
const readTasks = () => {
  const fileData = fs.readFileSync(tasksFilePath, 'utf8');
  return JSON.parse(fileData);
};

// Güncel görev listesini JSON dosyasına kaydeden yardımcı fonksiyon
const writeTasks = (tasks) => {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8');
};

// 1. Tüm görevleri listele (Filtreleme, Sıralama ve Sayfalama destekli)
const getAllTasks = (req, res) => {
  let tasks = readTasks();
  const { status, priority, sort, page, limit } = req.query;

  // Duruma göre filtreleme (?status=completed)
  if (status) {
    tasks = tasks.filter((item) => item.status === status);
  }

  // Önceliğe göre filtreleme (?priority=high)
  if (priority) {
    tasks = tasks.filter((item) => item.priority === priority);
  }

  // Oluşturulma tarihine göre sıralama (?sort=createdAt)
  if (sort === 'createdAt') {
    tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  // Sayfalama işlemi (?page=1&limit=10)
  if (page && limit) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;

    tasks = tasks.slice(startIndex, endIndex);
  }

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
};

// Anahtar kelimeye göre görev arama (GET /tasks/search?keyword=backend)
const searchTasks = (req, res) => {
  const tasks = readTasks();
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({
      success: false,
      message: 'Arama yapmak için keyword parametresi göndermelisiniz.'
    });
  }

  const lowerKeyword = keyword.toLowerCase();

  // Başlıkta veya açıklamada aranan kelime geçiyorsa listeye dahil et
  const matchedTasks = tasks.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerKeyword) ||
      item.description.toLowerCase().includes(lowerKeyword)
  );

  res.status(200).json({
    success: true,
    count: matchedTasks.length,
    data: matchedTasks
  });
};

// Kullanıcıya (atanan kişiye) göre görevleri listele (GET /tasks/assignee/:name)
const getTasksByAssignee = (req, res) => {
  const tasks = readTasks();
  const assigneeName = req.params.name.toLowerCase();

  const userTasks = tasks.filter(
    (item) => item.assignee.toLowerCase() === assigneeName
  );

  res.status(200).json({
    success: true,
    count: userTasks.length,
    data: userTasks
  });
};

// 2. Belirli bir görevin detayını getir (GET /tasks/:id)
const getTaskById = (req, res) => {
  const tasks = readTasks();
  const taskId = Number(req.params.id);

  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Belirtilen ID ile görev bulunamadı.'
    });
  }

  res.status(200).json({
    success: true,
    data: task
  });
};

// 3. Yeni görev oluştur (POST /tasks)
const createTask = (req, res) => {
  const tasks = readTasks();
  const { title, description, status, priority, assignee } = req.body;

  // Son görevin ID'sine 1 ekleyerek yeni ID belirle
  const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

  const newTask = {
    id: newId,
    title,
    description,
    status: status || 'pending',
    priority: priority || 'medium',
    assignee,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  writeTasks(tasks);

  res.status(201).json({
    success: true,
    message: 'Görev başarıyla oluşturuldu.',
    data: newTask
  });
};

// 4. Görev bilgilerini güncelle (PUT /tasks/:id)
const updateTask = (req, res) => {
  const tasks = readTasks();
  const taskId = Number(req.params.id);

  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Güncellenecek görev bulunamadı.'
    });
  }

  const { title, description, status, priority, assignee } = req.body;
  const currentTask = tasks[taskIndex];

  // Sadece gönderilen alanları güncelle, gönderilmeyenleri olduğu gibi koru
  tasks[taskIndex] = {
    ...currentTask,
    title: title !== undefined ? title : currentTask.title,
    description: description !== undefined ? description : currentTask.description,
    status: status !== undefined ? status : currentTask.status,
    priority: priority !== undefined ? priority : currentTask.priority,
    assignee: assignee !== undefined ? assignee : currentTask.assignee
  };

  writeTasks(tasks);

  res.status(200).json({
    success: true,
    message: 'Görev başarıyla güncellendi.',
    data: tasks[taskIndex]
  });
};

// 5. Görevi sil (DELETE /tasks/:id)
const deleteTask = (req, res) => {
  const tasks = readTasks();
  const taskId = Number(req.params.id);

  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Silinecek görev bulunamadı.'
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  writeTasks(tasks);

  res.status(200).json({
    success: true,
    message: 'Görev başarıyla silindi.',
    data: deletedTask
  });
};

module.exports = {
  getAllTasks,
  searchTasks,
  getTasksByAssignee,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
