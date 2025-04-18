FROM golang:1.18 AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y git curl

RUN curl https://raw.githubusercontent.com/golang/dep/master/install.sh -o install.sh && \
    chmod +x install.sh && \
    ./install.sh && \
    mv /go/bin/dep /usr/local/bin/dep

COPY . .

RUN dep ensure -v
RUN go build -o auth-api

FROM debian:bullseye-slim

WORKDIR /root/

COPY --from=builder /app/auth-api .

EXPOSE 8081

CMD ["./auth-api"]
