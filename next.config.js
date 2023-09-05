/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    images: {
        domains: ['cdn.discordapp.com', 'i.imgur.com']
    }
}

module.exports = nextConfig
