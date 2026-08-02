module.exports = {
  apps: [{
    name: 'currypuffcounter',
    script: 'server.js',
    max_memory_restart: '450M',
    env: {
      NODE_ENV: 'production',
      PORT: 6000,
      NODE_OPTIONS: '--max-old-space-size=400',
    },
  }],
};
