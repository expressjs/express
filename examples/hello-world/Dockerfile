FROM node:18-alpine

WORKDIR /app

# Copy package.json files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY . .

# Expose port 8080 as per assignment requirement
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
