#!/bin/bash

echo "Building RODOS2 Application..."

# Build React frontend
echo "Building React frontend..."
cd rodos2-ui
npm install
npm run build
echo "React build completed"

# Copy React build files to Spring Boot static resources
echo "Copying React build files to Spring Boot..."
rm -rf ../rodos2-server/src/main/resources/static/*
cp -r build/* ../rodos2-server/src/main/resources/static/
echo "React files copied to Spring Boot static resources"

cd ..

# Build Spring Boot backend
echo "Building Spring Boot backend..."
cd rodos2-server
./gradlew build -x test
cd ..

echo "Build completed successfully!"
echo "JAR file location: rodos2-server/build/libs/rodos2-server-0.0.1-SNAPSHOT.jar"
echo ""
echo "To run the application:"
echo "java -jar rodos2-server/build/libs/rodos2-server-0.0.1-SNAPSHOT.jar"
echo ""
echo "After running, open your browser and go to:"
echo "http://localhost:8080"
