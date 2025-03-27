FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "  echo 'Esperando que la base de datos esté lista...' &&  until nc -z -v -w30 db 5432; do    echo 'Esperando que la base de datos esté disponible...' &&    sleep 5;  done &&  echo 'Base de datos lista. Iniciando el servidor...' && tcs && node dist/index.js"]

