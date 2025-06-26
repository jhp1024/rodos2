## RODOS2
### Robot Organization & DistributiOn System
### Robot Orchestration & DistributiOn System
### Robot cOmposition & DistributiOn System

## 사용 방법
### 1. rodos2-ui (프론트엔드)

설치 및 실행
''
cd rodos2-ui
npm install
npm start
''
위 명령어를 실행하면 브라우저에서 http://localhost:3000에서 UI를 사용할 수 있습니다.

### 2. rodos2-server (백엔드)
설치 및 실행
Apply
Run
cd rodos2-server
./mvnw spring-boot:run
또는
Apply
Run
cd rodos2-server
mvn spring-boot:run
서버는 기본적으로 http://localhost:8080에서 실행됩니다.

3. 전체 실행 순서
백엔드 서버 실행
rodos2-server 디렉토리에서 Spring Boot 서버를 먼저 실행합니다.
프론트엔드 실행
rodos2-ui 디렉토리에서 React 앱을 실행합니다.
웹 브라우저에서 접속
http://localhost:3000으로 접속하여 Information Model Editor 등 기능을 사용할 수 있습니다.
4. 기타
개발 환경: Node.js 16+, Java 11+ (OpenJDK 권장), Maven
