# Step 1: Use Node.js as the base image
FROM node:18-alpine

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy only necessary files to install dependencies
COPY ../../pnpm-lock.yaml ../../package.json ./
COPY ../../apps/server/package.json ./

# Step 4: Install dependencies (using pnpm)
RUN npm install -g pnpm && pnpm install --frozen-lockfile --filter server...

# Step 5: Copy the server code
COPY ../../apps/server .

# Step 6: Build the application
RUN pnpm build

# Step 7: Expose the port and run the app
EXPOSE 3000
CMD ["pnpm", "start:prod"]
