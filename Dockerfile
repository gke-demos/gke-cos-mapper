# Use a lightweight, modern Node.js image based on Alpine Linux
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json (and package-lock.json if it exists)
COPY package*.json ./

# Install only the production dependencies
RUN npm install --omit=dev

# Copy the application code
COPY app/ ./app/

# Expose the port the app will run on. Cloud Run provides this via $PORT.
EXPOSE 8080

# Define the command to run the application
CMD [ "npm", "start" ]