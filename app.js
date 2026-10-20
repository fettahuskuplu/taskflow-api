const express = require('express');
const logger = require('./middlewares/logger');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = 3000;

// İstek gövdesindeki (req.body) JSON verilerini okuyabilmek için
app.use(express.json());

// Gelen tüm istekleri loglayan middleware
app.use(logger);

// Ana sayfa kontrol ucu
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TaskFlow API sunucusu çalışıyor.'
  });
});

// Görev yönetim rotaları
app.use('/tasks', taskRoutes);

// Tanımsız bir adrese istek atıldığında dönecek 404 yanıtı
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Aradığınız uç nokta (endpoint) bulunamadı.'
  });
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor...`);
});
