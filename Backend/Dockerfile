# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy project files
COPY pom.xml .
COPY src ./src

# Build the WAR file (skipping tests to be safe during deploy)
RUN mvn clean package -DskipTests

# Stage 2: Run in Tomcat
FROM tomcat:10.1-jdk17

# Remove default Tomcat apps to keep it clean
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy the built WAR file to Tomcat's webapps directory
# Renaming to ROOT.war makes it available at the root URL (/) instead of /exam-system
COPY --from=build /app/target/exam-system-0.0.1-SNAPSHOT.war /usr/local/tomcat/webapps/ROOT.war

# Expose port 8080 (Default Tomcat port)
EXPOSE 8080

# Start Tomcat
CMD ["catalina.sh", "run"]
