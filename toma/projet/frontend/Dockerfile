

FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

RUN npm install

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

# Expose internal port for SSR
EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "start"]
