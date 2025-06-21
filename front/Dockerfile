FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm install -D @vitejs/plugin-react@latest && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
