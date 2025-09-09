@echo off
echo Building RODOS2 Application...

REM Build React frontend
echo Building React frontend...
cd rodos2-ui
call npm install
call npm run build
cd ..

REM Build Spring Boot backend
echo Building Spring Boot backend...
cd rodos2-server
call gradlew build -x test
cd ..

echo Build completed successfully!
echo JAR file location: rodos2-server\build\libs\rodos2-server-0.0.1-SNAPSHOT.jar
echo.
echo To run the application:
echo java -jar rodos2-server\build\libs\rodos2-server-0.0.1-SNAPSHOT.jar
pause
