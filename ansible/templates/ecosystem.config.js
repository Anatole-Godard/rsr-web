module.exports = {
  apps: [{
    name: 'rsr',
    exec_mode: 'cluster',
    instances: 1,
    script: ".node_modules/next/dist/bin/next",
    merge_logs: true,
    cwd: "/home/ophzl/app/",
    env: {
      NODE_ENV: 'production',
      PORT: '3000'
    }
  }],
};