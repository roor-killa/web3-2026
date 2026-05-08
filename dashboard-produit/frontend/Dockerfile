
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code (THIS is when the 'Test' change gets pulled in)
COPY . .

# Build the static version of your app
RUN npm run build

# The internal port Next.js listens on
EXPOSE 3000

# This runs only when the container starts up
CMD ["npm", "start"]