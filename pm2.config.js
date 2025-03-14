module.exports = {
  apps: [
    {
      name: "nextjs-app",
      script: "pnpm",
      args: "start -p 14000",
      cwd: "./apps/web",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "nestjs-app",
      script: "pnpm",
      args: "start",
      cwd: "./apps/server",
      env: {
        NODE_ENV: "production",
        PORT: "14001",
      },
    },
  ],
};
