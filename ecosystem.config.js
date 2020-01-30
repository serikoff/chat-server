module.exports = {
  apps : [{
    name: 'Server-chat',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: '3003',
      JWT_SECRET: 'UpFJfpWKYteH5rMHS3st',
      JWT_MAX_AGE: '7 days',
      CLOUDINARY_NAME: '',
      CLOUDINARY_API_KEY: '',
      CLOUDINARY_API_SECRET: '',
    }
  }]
};
