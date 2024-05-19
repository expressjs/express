FROM tomcat:8.0.21-jre8
COPY target/express.war /usr/local/tmp/tomcat/webapps/express.war
