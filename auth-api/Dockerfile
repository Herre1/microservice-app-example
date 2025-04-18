# Build stage
FROM golang:1.18 AS builder

# Configurar el GOPATH correctamente
ENV GOPATH /go
WORKDIR /go/src/github.com/microservice-app-example/auth-api

# Instalar dep
RUN curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh

# Copiar los archivos del proyecto
COPY . .

# Descargar dependencias y construir
RUN dep ensure -v
RUN go build -o auth-api

# Final stage
FROM debian:bullseye-slim

WORKDIR /root/

COPY --from=builder /go/src/github.com/microservice-app-example/auth-api/auth-api .

EXPOSE 8081

CMD ["./auth-api"]
