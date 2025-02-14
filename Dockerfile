
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production --project=FrontEndAngular \
    && ls -R /app/dist

FROM nginx:1.25-alpine
COPY --from=build /app/dist/FrontEndAngular/browser /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
