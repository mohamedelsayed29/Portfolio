// PM2 process definition for production.
// Keep the configured path stable: PM2 retains pm_exec_path across reloads.
const appDir = process.env.APP_DIR || '/var/www/hammerload'

module.exports = {
  apps: [
    {
      name: 'hammerload',
      cwd: `${appDir}/current`,
      script: `${appDir}/current/server/index.js`,
      exec_mode: 'fork',
      instances: 1,
      max_memory_restart: '300M',
      kill_timeout: 5000,
      time: true,
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 4000,
        HOST: '127.0.0.1',
        BOOKING_TRUSTED_PROXIES: '127.0.0.1,::1',
        BOOKING_RATE_LIMIT_FILE: `${appDir}/shared/booking-security/quotas.json`,
      },
    },
  ],
}
