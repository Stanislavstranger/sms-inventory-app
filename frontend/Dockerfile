FROM node:20-alpine AS build

WORKDIR /app

COPY . .

RUN npm install

WORKDIR /app/frontend

RUN npm run build

FROM nginx:alpine AS production

COPY --from=build /app/frontend/dist /usr/share/nginx/html

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
