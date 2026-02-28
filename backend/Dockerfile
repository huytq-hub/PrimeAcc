FROM node:24-alpine

# Disable npm update notifications
ENV NPM_CONFIG_UPDATE_NOTIFIER=false

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build application
RUN npm run build && ls -la dist/ && echo "Build successful, dist folder contains:" && ls -la dist/

# Expose port
EXPOSE 3000

# Start application - use dev mode for now
CMD ["npm", "run", "start:dev"]
