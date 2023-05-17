FROM node:12

WORKDIR /usr/src/app
COPY . .
RUN  npm install --force
EXPOSE 4000
CMD ["node","src/api/app.js"]