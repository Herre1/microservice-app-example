# Build stage
FROM golang:1.18-alpine AS builder

WORKDIR /app

# Instalar dep
RUN apk add --no-cache git curl
RUN curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh

COPY . .

# Usar dep en lugar de go mod
RUN dep ensure
RUN go build -o auth-api

# Final stage
FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/auth-api .

EXPOSE 8081

CMD ["./auth-api"]