# TaskFlow — Görev ve Proje Yönetim Sistemi API

Node.js ve Express.js kullanılarak geliştirilmiş, ekip içi görevlerin oluşturulmasını, çalışanlara atanmasını, durum/öncelik takibini ve raporlama süreçlerini yöneten RESTful API projesi.

---

## Temel Özellikler

* **Tam Kapsamlı CRUD İşlemleri:** Görev ekleme, listeleme, detay görüntüleme, güncelleme ve silme.
* **Kalıcı Veri Yönetimi:** Node.js `fs` modülü ile `data/tasks.json` dosyası üzerinde veri okuma ve yazma.
* **Logger Middleware:** Gelen tüm HTTP isteklerinin zaman damgası, metod ve adres bilgisiyle hem konsola hem de `logs.txt` dosyasına kaydedilmesi.
* **Validation Middleware:** Görev oluştururken zorunlu alanların (`title`, `description`, `priority`, `assignee`) ve öncelik değerlerinin doğrulanması (`400 Bad Request`).
* **Gelişmiş Sorgulama:** Durum (`status`), öncelik (`priority`), anahtar kelime araması (`keyword`), atanan kişi (`assignee`), sıralama (`sort`) ve sayfalama (`page`, `limit`) desteği.
* **Raporlama Servisleri:** Tamamlanan görevler, bekleyen görevler ve genel sistem özeti uç noktaları.

---

## Proje Klasör Yapısı

```text
taskflow-api/
├── controllers/
│   ├── taskController.js      # Görev CRUD, filtreleme ve arama işlemleri
│   └── reportController.js    # İstatistik ve raporlama işlemleri
├── data/
│   └── tasks.json             # Görev verilerinin tutulduğu JSON dosyası
├── middlewares/
│   ├── logger.js              # İstekleri konsola ve dosyaya kaydeden middleware
│   └── validateTask.js        # Görev verilerini doğrulayan middleware
├── routes/
│   ├── taskRoutes.js          # /tasks uç noktası yönlendirmeleri
│   └── reportRoutes.js        # /reports uç noktası yönlendirmeleri
├── app.js                     # Express sunucu yapılandırması ve başlangıç dosyası
├── package.json               # Proje bağımlılıkları ve çalışma komutları
├── PROJE_TANITIM_DOKUMANI.md  # Proje senaryosu, veri modeli ve test dokümanı
└── README.md                  # Kurulum ve API kullanım kılavuzu
```

---

## Kurulum ve Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

### 1. Projeyi İndirin
```bash
git clone https://github.com/fettahuskuplu/taskflow-api.git
cd taskflow-api
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Sunucuyu Başlatın
```bash
npm start
```
Sunucu varsayılan olarak **`http://localhost:3000`** adresinde çalışmaya başlayacaktır.

---

## API Uç Noktaları (Endpoints) Özeti

### 1. Görev Yönetimi (`/tasks`)

| Metod | Endpoint | Açıklama |
| :--- | :--- | :--- |
| `GET` | `/tasks` | Tüm görevleri listeler |
| `GET` | `/tasks/:id` | Belirli bir görevin detayını getirir |
| `POST` | `/tasks` | Yeni bir görev oluşturur |
| `PUT` | `/tasks/:id` | Mevcut bir görevin bilgilerini günceller |
| `DELETE` | `/tasks/:id` | Belirtilen görevi sistemden siler |

### 2. Gelişmiş Filtreleme, Arama ve Sayfalama

| Metod | Örnek Endpoint | Açıklama |
| :--- | :--- | :--- |
| `GET` | `/tasks?status=completed` | Duruma göre filtreler (`pending`, `in-progress`, `completed`) |
| `GET` | `/tasks?priority=high` | Önceliğe göre filtreler (`low`, `medium`, `high`) |
| `GET` | `/tasks/search?keyword=backend` | Başlık veya açıklamada anahtar kelime arar |
| `GET` | `/tasks/assignee/musa` | Belirli bir çalışana atanmış görevleri listeler |
| `GET` | `/tasks?page=1&limit=10` | Görevleri sayfalı olarak getirir |
| `GET` | `/tasks?sort=createdAt` | Görevleri oluşturulma tarihine göre sıralar |

### 3. Raporlama Servisleri (`/reports`)

| Metod | Endpoint | Açıklama |
| :--- | :--- | :--- |
| `GET` | `/reports/completed` | Tamamlanan görev sayısını ve listesini döndürür |
| `GET` | `/reports/pending` | Bekleyen görev sayısını ve listesini döndürür |
| `GET` | `/reports/summary` | Durum ve öncelik dağılımlarını içeren genel sistem özetini döndürür |

---

## Örnek İstek (Request) ve Yanıt (Response) Kullanımı

### Yeni Görev Ekleme (`POST /tasks`)

**İstek Gövdesi (Request Body):**
```json
{
  "title": "API dokümantasyonunun hazırlanması",
  "description": "Tüm uç noktalar için örnek istek ve yanıtların yazılması.",
  "status": "in-progress",
  "priority": "high",
  "assignee": "fettah"
}
```

**Başarılı Yanıt (`201 Created`):**
```json
{
  "success": true,
  "message": "Görev başarıyla oluşturuldu.",
  "data": {
    "id": 6,
    "title": "API dokümantasyonunun hazırlanması",
    "description": "Tüm uç noktalar için örnek istek ve yanıtların yazılması.",
    "status": "in-progress",
    "priority": "high",
    "assignee": "fettah",
    "createdAt": "2026-10-26T12:30:00.000Z"
  }
}
```

**Eksik/Hatalı Veri Yanıtı (`400 Bad Request`):**
```json
{
  "success": false,
  "message": "Eksik veri gönderildi. Lütfen title, description, priority ve assignee alanlarını eksiksiz doldurun."
}
```

---

### Görev Güncelleme (`PUT /tasks/3`)

**İstek Gövdesi (Request Body):**
```json
{
  "status": "completed",
  "priority": "high"
}
```

**Başarılı Yanıt (`200 OK`):**
```json
{
  "success": true,
  "message": "Görev başarıyla güncellendi.",
  "data": {
    "id": 3,
    "title": "Logger middleware entegrasyonu",
    "description": "Sunucuya gelen tüm API isteklerinin metod, adres ve tarih bilgisiyle kayıt altına alınması.",
    "status": "completed",
    "priority": "high",
    "assignee": "musa",
    "createdAt": "2026-10-17T14:20:00.000Z"
  }
}
```

---

### Genel Sistem Özeti Raporu (`GET /reports/summary`)

**Başarılı Yanıt (`200 OK`):**
```json
{
  "success": true,
  "summary": {
    "totalTasks": 5,
    "byStatus": {
      "completed": 2,
      "inProgress": 1,
      "pending": 2
    },
    "byPriority": {
      "high": 2,
      "medium": 2,
      "low": 1
    }
  }
}
```
