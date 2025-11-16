# --- AŞAMA 1: Derleme (Build) ---
# Node.js'in 20. sürümünü "builder" olarak kullan
FROM node:20-alpine AS builder

# Çalışma dizinini /app olarak ayarla
WORKDIR /app

# Sadece 'package.json' dosyalarını kopyala
COPY package*.json ./

# 'npm install' yerine 'npm ci' kullan
RUN npm ci

# Tüm proje kaynak kodunu kopyala
COPY . .

# NestJS projesini "canlı" (production) için derle
RUN npm run build


# --- AŞAMA 2: Çalıştırma (Run) ---
# Daha küçük (güvenli) bir Node.js sürümü kullan
FROM node:20-alpine AS production

WORKDIR /app

# Sadece 'package.json' dosyalarını tekrar kopyala
COPY package*.json ./

# Sadece "canlı" (production) bağımlılıklarını kur
RUN npm ci --omit=dev

# "builder" aşamasından DERLENMİŞ dosyaları (/dist)
# ve 'node_modules'i bu yeni imajın içine kopyala
COPY --from=builder /app/dist ./dist

# 3000 portunu dışarıya aç
EXPOSE 3000

# Konteyner başladığında 'main.js' dosyasını çalıştır
CMD ["node", "dist/main"]