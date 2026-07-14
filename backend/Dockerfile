FROM node:18-alpine

WORKDIR /app

# Install dependencies first for caching
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the backend port (assuming 5000 based on typical setups)
EXPOSE 5000

# Start the application using the start script (runs node dist/server.js)
CMD ["npm", "start"]
