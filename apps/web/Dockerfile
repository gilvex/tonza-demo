# Step 1: Use Node.js as the base image
FROM node:18-alpine AS builder

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy only necessary files to install dependencies
COPY ../../pnpm-lock.yaml ../../package.json ./
COPY ../../apps/web/package.json ./

# Step 4: Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile --filter web...

# Step 5: Copy the frontend code
COPY ../../apps/web .

# Step 6: Build the Next.js application
RUN pnpm build

# Step 7: Production image for running the app
FROM node:18-alpine
WORKDIR /app

# Copy the built application
COPY --from=builder /app ./

# Expose the port and run the app
EXPOSE 3000
CMD ["pnpm", "start"]
