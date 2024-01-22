/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL: 'http://localhost:3000',
  },
}

module.exports = nextConfig

module.exports = {
  i18n: {
    locales: ['ru', 'en', 'bg', 'pt', 'ua', 'ro', 'ge', 'az', 'cs', 'sk', 'es', 'pl', 'kz', 'fr', 'uz', 'vi', 'de', 'tr', 'am', 'ky', 'hu', 'ka'],
    defaultLocale: 'ru',
  },
}
