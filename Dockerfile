# RODOS2 단일 JAR 배포용 Dockerfile
FROM openjdk:17-jre-slim

WORKDIR /app

# JAR 파일 복사
COPY rodos2-server/build/libs/rodos2-server-0.0.1-SNAPSHOT.jar app.jar

# 포트 노출
EXPOSE 8080

# 실행
CMD ["java", "-jar", "app.jar"]