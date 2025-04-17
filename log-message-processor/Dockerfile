FROM python:3.6-alpine

WORKDIR /app
COPY requirements.txt .
RUN pip3 install -r requirements.txt
COPY . .

ENV REDIS_HOST=redis
ENV REDIS_PORT=6379
ENV REDIS_CHANNEL=log_channel

CMD ["python3", "main.py"] 