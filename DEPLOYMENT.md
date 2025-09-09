# RODOS2 클라우드 배포 가이드

## 개요
RODOS2 애플리케이션을 클라우드에 배포하는 다양한 방법을 설명합니다.

## 배포 방법

### 1. Docker 컨테이너 배포 (권장)

#### 로컬에서 Docker 이미지 빌드
```bash
# Docker 이미지 빌드
docker build -t rodos2-app .

# 로컬에서 실행 테스트
docker run -p 8080:8080 rodos2-app
```

#### Docker Compose 사용
```bash
# 애플리케이션 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 애플리케이션 중지
docker-compose down
```

### 2. JAR 파일 직접 배포

#### 빌드 스크립트 실행
```bash
# Windows
build.bat

# Linux/Mac
chmod +x build.sh
./build.sh
```

#### JAR 파일 실행
```bash
java -jar rodos2-server/build/libs/rodos2-server-0.0.1-SNAPSHOT.jar
```

### 3. 클라우드 플랫폼별 배포

#### AWS 배포

**1. AWS ECS (Elastic Container Service)**
```bash
# ECR에 이미지 푸시
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin [ACCOUNT_ID].dkr.ecr.ap-northeast-2.amazonaws.com
docker tag rodos2-app:latest [ACCOUNT_ID].dkr.ecr.ap-northeast-2.amazonaws.com/rodos2-app:latest
docker push [ACCOUNT_ID].dkr.ecr.ap-northeast-2.amazonaws.com/rodos2-app:latest
```

**2. AWS Elastic Beanstalk**
- JAR 파일을 ZIP으로 압축
- Elastic Beanstalk 콘솔에서 Java 플랫폼으로 업로드

**3. AWS EC2**
```bash
# EC2 인스턴스에 접속 후
sudo yum update -y
sudo yum install -y java-17-openjdk
java -jar rodos2-server-0.0.1-SNAPSHOT.jar
```

#### Google Cloud Platform (GCP)

**1. Cloud Run**
```bash
# 이미지 빌드 및 푸시
gcloud builds submit --tag gcr.io/[PROJECT_ID]/rodos2-app
gcloud run deploy --image gcr.io/[PROJECT_ID]/rodos2-app --platform managed
```

**2. App Engine**
- `app.yaml` 파일 생성 필요
- JAR 파일을 App Engine에 배포

#### Microsoft Azure

**1. Azure Container Instances**
```bash
# Azure Container Registry에 푸시
az acr build --registry [REGISTRY_NAME] --image rodos2-app .
az container create --resource-group [RESOURCE_GROUP] --name rodos2-app --image [REGISTRY_NAME].azurecr.io/rodos2-app:latest --ports 8080
```

**2. Azure App Service**
- JAR 파일을 App Service에 배포

#### Heroku

**1. Heroku CLI 설치 후**
```bash
# Heroku 앱 생성
heroku create rodos2-app

# Procfile 생성 (프로젝트 루트에)
echo "web: java -jar rodos2-server/build/libs/rodos2-server-0.0.1-SNAPSHOT.jar" > Procfile

# 배포
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 4. Kubernetes 배포

#### Kubernetes 매니페스트 파일 생성
```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rodos2-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: rodos2-app
  template:
    metadata:
      labels:
        app: rodos2-app
    spec:
      containers:
      - name: rodos2-app
        image: rodos2-app:latest
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: rodos2-service
spec:
  selector:
    app: rodos2-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: LoadBalancer
```

#### Kubernetes 배포
```bash
kubectl apply -f k8s-deployment.yaml
```

## 환경 변수 설정

### 프로덕션 환경 설정
```bash
# application-prod.properties
spring.profiles.active=production
server.port=8080
logging.level.com.java.kr.ac.kangwon=INFO
```

### Docker 환경 변수
```bash
docker run -e SPRING_PROFILES_ACTIVE=production -e JAVA_OPTS="-Xmx512m" -p 8080:8080 rodos2-app
```

## 모니터링 및 로그

### Health Check
- 애플리케이션 상태 확인: `http://localhost:8080/actuator/health`
- 메트릭 확인: `http://localhost:8080/actuator/metrics`

### 로그 확인
```bash
# Docker 로그
docker logs [CONTAINER_ID]

# Kubernetes 로그
kubectl logs [POD_NAME]
```

## 보안 고려사항

1. **HTTPS 설정**: 클라우드 로드밸런서에서 SSL 인증서 설정
2. **방화벽**: 필요한 포트만 열기 (8080)
3. **환경 변수**: 민감한 정보는 환경 변수로 관리
4. **리소스 제한**: CPU/메모리 사용량 제한 설정

## 비용 최적화

1. **Auto Scaling**: 트래픽에 따른 자동 스케일링 설정
2. **리소스 모니터링**: 사용량에 따른 인스턴스 크기 조정
3. **Reserved Instances**: 장기 사용 시 예약 인스턴스 활용

## 트러블슈팅

### 일반적인 문제
1. **메모리 부족**: JVM 힙 크기 조정 (`-Xmx`, `-Xms`)
2. **포트 충돌**: 다른 포트 사용 또는 포트 해제
3. **네트워크 문제**: 방화벽 및 보안 그룹 설정 확인

### 로그 확인 명령어
```bash
# 애플리케이션 로그
tail -f logs/application.log

# 시스템 리소스 확인
top
free -h
df -h
```
