# Etapa de build con Java 8
FROM maven:3.8.4-openjdk-8-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa de ejecución con Java 8
FROM openjdk:8-jre-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

ENV JWT_SECRET=PRFT
ENV SERVER_PORT=8083

EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"] 