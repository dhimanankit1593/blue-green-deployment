FROM node:18

WORKDIR /app

COPY app.js .

EXPOSE 8000

CMD ["node", "app.js"]
