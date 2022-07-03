module.exports = {
  apps: [{
    name: 'rsr', // App name that shows in `pm2 ls`
    exec_mode: 'cluster', // enables clustering
    instances: 1, // or an integer
    script: "./node_modules/next/dist/bin/next",
    args: "start",
    cwd: "/home/ophzl/app/"
  }],
};