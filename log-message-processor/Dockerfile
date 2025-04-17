FROM python:3.6-alpine

WORKDIR /app

# Instalar dependencias necesarias para compilar extensiones en Alpine
RUN apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev \
    openssl-dev \
    python3-dev \
    build-base

COPY requirements.txt .

RUN pip3 install --upgrade pip && \
    pip3 install -r requirements.txt

COPY . .

# Definir variables de entorno por defecto (puedes sobreescribirlas en el despliegue)
ENV REDIS_HOST=localhost \
    REDIS_PORT=6379 \
    REDIS_CHANNEL=log_channel

CMD ["python3", "main.py"] 