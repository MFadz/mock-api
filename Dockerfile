# Use a recent Node version that supports ESM well
FROM node:20-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy only package files first (for better build cache)
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the source code
COPY . .

# Set NODE_ENV
ENV NODE_ENV=production

# Expose the port your app uses (change if not 3000)
EXPOSE 3000

# Start your app (uses ESM because of "type": "module")
USER node
CMD ["pm2-runtime", "app.js", "-i", "max"]
