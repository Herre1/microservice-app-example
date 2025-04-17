FROM golang:1.18.2-alpine as builder

WORKDIR /app
COPY . .

RUN export GO111MODULE=on && \
    go mod init github.com/Herre1/microservice-app-example/tree/master/auth-api && \
    go mod tidy && \
    go build -o auth-api

FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/auth-api .

ENV AUTH_API_PORT=8081
ENV USERS_API_ADDRESS=http://users-api:8083
ENV JWT_SECRET=PRFT

EXPOSE 8081

CMD ["./auth-api"] 