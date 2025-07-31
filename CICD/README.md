# CI/CD Pipeline Setup using Jenkins

## Overview

This project demonstrates CI/CD setup for a simple Node.js "Hello, World!" app using Jenkins and Docker.

##  Steps Performed
1. **app** Node js servers 
2. **Containerization** using Docker
3. **CI** using Jenkins to build, test, and package
4. **CD** using Jenkins to deploy to a Docker container

## Tech Stack
- **Node.js** – for building the app
- **Docker** – to containerize the application
- **Jenkins** – for CI/CD pipeline
- **GitHub** – for source code version control
- **Staging server** – for deployment (simulated via SSH)

Jenkins: Widely used, flexible for both CI and CD.
Docker: To ensure consistency across environments.
GitHub: GitHub allows public repositories, making it simple to share the project with evaluators or collaborators.

## Assumptions
- Docker is installed on the Jenkins agent
- Dummy test included

## How to Run
- Set up a Jenkins pipeline job using `Jenkinsfile`
- Push code to trigger the pipeline

##  CI/CD using Jenkins
**Jenkinsfile Highlights**
Triggers on push to main
Builds Docker image
Runs dummy tests
Pushes image to Docker Hub
Deploys to staging

## Rollback Strategy:
Maintain :previous tag for rollback
Re-deploy previous tag if current deployment fails

Note: Since it's not multistage docket image not included docker-compose file