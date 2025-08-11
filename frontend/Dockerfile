# Etapa de build do Next.js
FROM node:18-alpine as builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa final: servir com NGINX
FROM nginx:alpine

# Remove config padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copia os arquivos exportados
COPY --from=builder /app/out /usr/share/nginx/html

# Copia nova configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
