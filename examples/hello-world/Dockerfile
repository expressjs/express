# Use official Node.js LTS base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose port 8080 for the container
EXPOSE 8080

# Command to start the application
CMD ["node", "index.js"]
