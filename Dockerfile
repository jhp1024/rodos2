# Multi-stage build for RODOS2 application
FROM node:18-alpine AS frontend-build

# Set working directory
WORKDIR /app

# Copy package files
COPY rodos2-ui/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY rodos2-ui/ .

# Build React app
RUN npm run build

# Stage 2: Build Spring Boot application
FROM openjdk:17-jdk-slim AS backend-build

# Set working directory
WORKDIR /app

# Copy Gradle files
COPY rodos2-server/build.gradle.kts .
COPY rodos2-server/settings.gradle.kts .
COPY rodos2-server/gradle/ ./gradle/
COPY rodos2-server/gradlew .
COPY rodos2-server/gradlew.bat .

# Copy source code
COPY rodos2-server/src/ ./src/

# Copy built frontend from previous stage
COPY --from=frontend-build /app/build/ ./src/main/resources/static/

# Make gradlew executable
RUN chmod +x ./gradlew

# Build the application
RUN ./gradlew build -x test

# Stage 3: Runtime image
FROM openjdk:17-jre-slim

# Set working directory
WORKDIR /app

# Copy the built JAR file
COPY --from=backend-build /app/build/libs/*.jar app.jar

# Expose port
EXPOSE 8080

# Set JVM options for production
ENV JAVA_OPTS="-Xmx512m -Xms256m -Djava.security.egd=file:/dev/./urandom"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
