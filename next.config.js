/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	transpilePackages: ["geist"],
	images: {
		remotePatterns: [
			{
				hostname: 'placehold.co'
			},
		],
	},
}

module.exports = nextConfig
