# TaskFlow — Proje Tanıtım ve Sistem Tasarım Dokümanı

## 1. Projenin Amacı
Bu projenin amacı, Node.js ve Express.js teknolojilerini kullanarak gerçek hayatta bir yazılım ekibinin ihtiyaç duyabileceği Görev ve Proje Yönetim Sistemi API'sini (TaskFlow) REST mimarisine uygun şekilde tasarlamak ve geliştirmektir.

Uygulama; görevlerin oluşturulması, ekip üyelerine atanması, görev durumlarının ve önceliklerinin takip edilmesi, filtrelenmesi ve özet raporların alınması süreçlerini standart HTTP metotları ve durum kodları üzerinden yönetir.

---

## 2. Proje Senaryosu
Bir yazılım geliştirme ekibi, yürüttüğü projelerdeki görevleri ve çalışanların sorumluluklarını tek bir merkezden takip etmek istemektedir. Geliştirilen **TaskFlow REST API** sistemi sayesinde:
* Yeni görevler oluşturulup ilgili ekip üyesine (`assignee`) atanabilir.
* Görevlerin aciliyet durumu (`low`, `medium`, `high`) belirlenebilir.
* Görevlerin ilerleme aşamaları (`pending`, `in-progress`, `completed`) güncellenebilir.
* Tamamlanan veya bekleyen işler filtrelenebilir, anahtar kelime ile görev aranabilir ve yönetici özet raporları alınabilir.

---

## 3. Sistem Mimarisi ve Katmanlı Yapı
Proje, okunabilirliği ve bakım kolaylığını artırmak amacıyla katmanlı bir klasör yapısıyla kurgulanmıştır:

* **Sunucu Katmanı (`app.js`):** Express uygulamasının başlatıldığı, JSON veri ayrıştırıcısının (`express.json()`), global `logger` middleware'inin, ana yönlendirmelerin ve 404 hata yakalayıcısının tanımlandığı merkezdir.
* **Yönlendirme Katmanı (`routes/`):** İlgili URL adreslerine (`GET /tasks`, `POST /tasks`, `GET /reports/summary` vb.) gelen istekleri karşılayıp doğru kontrolcü fonksiyonuna yönlendiren katmandır.
* **İş Mantığı Katmanı (`controllers/`):** JSON dosyasından veri okuma/yazma, filtreleme, sıralama, sayfalama ve CRUD işlemlerinin gerçekleştirildiği katmandır.
* **Ara Katmanlar (`middlewares/`):**
  * `logger.js`: Gelen her isteğin zaman damgasını, HTTP metodunu ve URL adresini konsola ve `logs.txt` dosyasına kaydeder.
  * `validateTask.js`: Yeni görev ekleme isteklerinde zorunlu alanları ve veri geçerliliğini kontrol ederek hatalı istekleri `400 Bad Request` koduyla engeller.
* **Veri Katmanı (`data/tasks.json`):** Görev verilerinin Node.js yerleşik `fs` (File System) modülü aracılığıyla kalıcı olarak saklandığı JSON dosyasıdır.

---

## 4. Veri Modeli Tasarımı (Task Şeması)

Sistemde her bir görev nesnesi aşağıdaki alanlardan oluşmaktadır:

| Alan Adı | Veri Tipi | Zorunluluk | Açıklama ve Alabileceği Değerler |
| :--- | :--- | :--- | :--- |
| `id` | `Number` | Otomatik | Görevin benzersiz kimlik numarası (`1`, `2`, `3`...) |
| `title` | `String` | Zorunlu | Görevin kısa başlığı |
| `description` | `String` | Zorunlu | Görev kapsamında yapılacak işin detaylı açıklaması |
| `status` | `String` | Varsayılan: `pending` | Görevin durumu: `pending`, `in-progress`, `completed` |
| `priority` | `String` | Zorunlu | Görevin öncelik seviyesi: `low`, `medium`, `high` |
| `assignee` | `String` | Zorunlu | Görevin atandığı ekip üyesinin adı |
| `createdAt` | `String` | Otomatik | Görevin oluşturulma zamanı (ISO 8601 formatında tarih damgası) |

---

## 5. Yazılı Test Senaryoları (Test Dokümantasyonu)

API uç noktalarının doğruluğunu kontrol etmek üzere hazırlanan Postman test senaryoları aşağıda listelenmiştir:

| Test No | Test Senaryosu | İstek (Method & URL) | Gönderilen Veri (Body) | Beklenen Durum Kodu | Beklenen Sonuç |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **T-01** | Tüm görevlerin listelenmesi | `GET /tasks` | - | `200 OK` | Kayıtlı tüm görevlerin JSON dizisi olarak dönmesi |
| **T-02** | Belirli bir görevin detayının getirilmesi | `GET /tasks/1` | - | `200 OK` | `id: 1` olan görevin bilgilerinin dönmesi |
| **T-03** | Olmayan bir görevin sorgulanması | `GET /tasks/999` | - | `404 Not Found` | Görev bulunamadı hata mesajının dönmesi |
| **T-04** | Yeni görev oluşturulması | `POST /tasks` | Geçerli `title`, `description`, `priority`, `assignee` | `201 Created` | Yeni görevin ID ve tarih atanarak kaydedilmesi |
| **T-05** | Eksik veri ile görev ekleme testi (Validation) | `POST /tasks` | Sadece `title` alanı | `400 Bad Request` | Validation middleware'in eksik veri uyarısı dönmesi |
| **T-06** | Görev bilgilerinin güncellenmesi | `PUT /tasks/3` | `{ "status": "completed" }` | `200 OK` | İlgili görevin durumunun güncellenmesi |
| **T-07** | Görevin silinmesi | `DELETE /tasks/5` | - | `200 OK` | Görevin listeden ve `tasks.json` dosyasından kaldırılması |
| **T-08** | Durum ve önceliğe göre filtreleme | `GET /tasks?status=completed&priority=high` | - | `200 OK` | Yalnızca tamamlanmış ve yüksek öncelikli görevlerin dönmesi |
| **T-09** | Anahtar kelime ile görev arama | `GET /tasks/search?keyword=backend` | - | `200 OK` | Başlık veya açıklamasında `backend` geçen görevlerin dönmesi |
| **T-10** | Genel sistem özeti raporu | `GET /reports/summary` | - | `200 OK` | Toplam görev, durum ve öncelik istatistiklerinin dönmesi |
