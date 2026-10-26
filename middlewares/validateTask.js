// Görev oluştururken gönderilen verilerin doğruluğunu kontrol eden middleware
const validateTask = (req, res, next) => {
  const { title, description, priority, assignee } = req.body;

  // Zorunlu alanların eksik olup olmadığını kontrol et
  if (!title || !description || !priority || !assignee) {
    return res.status(400).json({
      success: false,
      message: 'Eksik veri gönderildi. Lütfen title, description, priority ve assignee alanlarını eksiksiz doldurun.'
    });
  }

  // Öncelik (priority) değerinin geçerli bir seçenek olup olmadığını kontrol et
  const validPriorities = ['low', 'medium', 'high'];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: 'Geçersiz priority değeri. Sadece low, medium veya high değerlerinden biri kullanılabilir.'
    });
  }

  next();
};

module.exports = validateTask;
