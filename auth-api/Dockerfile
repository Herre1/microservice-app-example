# Etapa de construcción
FROM golang:1.18-alpine AS builder

WORKDIR /app

# Copiamos los archivos del proyecto
COPY . .

# Activamos el modo módulo de Go y resolvemos dependencias
RUN go mod tidy && go build -o auth-api

# Etapa final: imagen liviana para producción
FROM alpine:latest

WORKDIR /app

# Copiamos el binario desde la etapa de build
COPY --from=builder /app/auth-api .

# Variables de entorno
ENV AUTH_API_PORT=8081
ENV USERS_API_ADDRESS=http://users-api:8083
ENV JWT_SECRET=PRFT

# Exponemos el puerto configurable
EXPOSE 8081

# Ejecutamos el servicio (puede ser sobreescrito con docker run)
CMD ["./auth-api"] 