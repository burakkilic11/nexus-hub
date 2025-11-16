# --- AŞAMA 1: Derleme (Build) ---
# Node.js 20'yi "builder" olarak kullan
FROM node:20-alpine AS builder

WORKDIR /app

# Sadece 'package.json' dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları kur
RUN npm ci

# Tüm proje kaynak kodunu kopyala
COPY . .

# Angular projesini "canlı" (production) için derle
# Bu, /app/dist/client/browser klasörünü oluşturur
RUN npm run build


# --- AŞAMA 2: Sunma (Serve) ---
# "nginx:alpine" (küçük ve hızlı web sunucusu) kullan
FROM nginx:1.25-alpine

# "builder" aşamasından DERLENMİŞ Angular dosyalarını
# (/app/dist/client/browser) al ve Nginx'in HTML klasörüne kopyala
COPY --from=builder /app/dist/client/browser/ /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf