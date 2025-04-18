# Build stage
FROM golang:1.18-alpine AS builder

WORKDIR /app

# Instalar git y curl (necesarios para dep)
RUN apk add --no-cache git curl

# Instalar dep
RUN curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh

# Copiar archivos del proyecto
COPY . .

# Descargar dependencias y construir
RUN dep ensure -v
RUN go build -o auth-api

# Final stage
FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/auth-api .

EXPOSE 8081

CMD ["./auth-api"]