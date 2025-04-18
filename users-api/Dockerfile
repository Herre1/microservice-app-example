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

ENV JWT_SECRET=your-secret-key
ENV SERVER_PORT=8083
ENV SPRING_JPA_HIBERNATE_DDL_AUTO=update
ENV SPRING_JPA_GENERATE_DDL=true
ENV SPRING_DATASOURCE_URL=jdbc:h2:mem:usersdb;DB_CLOSE_DELAY=-1

EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]