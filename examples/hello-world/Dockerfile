# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy source code
COPY . .

# Install dependencies (not required for express hello-world, but general practice)
RUN npm install

# Expose port
EXPOSE 8080

# Run the app
CMD ["node", "index.js"]
