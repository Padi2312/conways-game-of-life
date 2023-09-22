FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM busybox:1.36
RUN adduser -D static
USER static
WORKDIR /app/static
COPY --from=build /app/dist /app/static/
CMD [ "busybox","httpd","-f","-v","-p","80" ]