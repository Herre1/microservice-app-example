FROM node:8.17.0-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV TODO_API_PORT=8082
ENV JWT_SECRET=PRFT
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379
ENV REDIS_CHANNEL=log_channel

EXPOSE 8082

CMD ["npm", "start"] 