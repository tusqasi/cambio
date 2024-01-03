import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { GeistSans } from 'geist/font/sans';


export default function App({ Component, pageProps }: AppProps) {
	return (
		<main className={GeistSans.className}>
			<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
			<Component {...pageProps} />
		</main>
	);
}
