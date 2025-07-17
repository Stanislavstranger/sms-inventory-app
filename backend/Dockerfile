FROM node:20-alpine AS build

WORKDIR /app

COPY . .

RUN npm install

WORKDIR /app/backend

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app/backend

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/backend/package.json ./

EXPOSE 3000

CMD ["node", "dist/main"]
