# Nexus Hub

Kişiselleştirilebilir bir "Productivity Hub" (Üretkenlik Merkezi).
Bu proje, NestJS ve Angular ile oluşturuldu.

## Teknoloji

* **Server:** NestJS, MongoDB (Docker Compose ile), JWT, Passport
* **Client:** Angular, SCSS, RxJS

---

## Projeyi Çalıştırma

### 1. Sunucu (NestJS) ve Veritabanı (Docker)

Sunucuyu çalıştırmadan önce, veritabanı konteynerinin ayakta olması gerekir.

```bash
# (Ana dizindeyken)
# 1. MongoDB konteynerini başlat
docker-compose up

# (İkinci bir terminalde, 'server' klasörüne gir)
cd server

# 2. NestJS sunucusunu başlat (Port: 3000)
npm run start:dev