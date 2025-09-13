FROM node:18 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN apt-get update && apt-get install -y dos2unix
RUN dos2unix node_modules/.bin/ng
RUN chmod +x node_modules/.bin/ng

RUN npm run build --configuration=production --project=FrontEndAngular

FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
