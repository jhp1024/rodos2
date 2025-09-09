#!/bin/bash

# RODOS2 클라우드 배포 스크립트

set -e

echo "🚀 RODOS2 클라우드 배포 시작..."

# 1. 환경 변수 설정
export COMPOSE_FILE=docker-compose.prod.yml
export PROJECT_NAME=rodos2

# 2. 기존 컨테이너 정리
echo "📦 기존 컨테이너 정리 중..."
docker-compose -f $COMPOSE_FILE down --remove-orphans

# 3. 이미지 빌드
echo "🔨 Docker 이미지 빌드 중..."
docker-compose -f $COMPOSE_FILE build --no-cache

# 4. 서비스 시작
echo "🚀 서비스 시작 중..."
docker-compose -f $COMPOSE_FILE up -d

# 5. 헬스 체크
echo "🏥 헬스 체크 중..."
sleep 30

# Backend 헬스 체크
if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo "✅ Backend 서비스 정상 동작"
else
    echo "❌ Backend 서비스 오류"
    exit 1
fi

# Frontend 헬스 체크
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend 서비스 정상 동작"
else
    echo "❌ Frontend 서비스 오류"
    exit 1
fi

# 6. 배포 완료
echo "🎉 RODOS2 배포 완료!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8080"
echo "📊 서비스 상태: docker-compose -f $COMPOSE_FILE ps"
