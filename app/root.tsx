import { type LinksFunction } from '@remix-run/node'
import { ParallaxProvider } from 'react-scroll-parallax'

import Document from '~/components/shared-layout/Document'
import { useNonce } from '~/utils/nonce-provider.ts'
import rootLinkElements from '~/utils/providers/rootLinkElements'
import FooterMenuRight from './components/organisms/Footer/FooterMenuRight.tsx'
import HeaderWithSearch from './components/organisms/HeaderWithSearch'
import ParallaxBackground from './components/organisms/Hero/ParallaxBackground.tsx'

export const links: LinksFunction = () => {
	return rootLinkElements
}
export { headers, meta } from './__root.client.tsx'
export { action, loader } from './__root.server.tsx'

export default function App() {
	const nonce = useNonce()

	return (
		<ParallaxProvider>
			<Document nonce={nonce}>
				<div className="flex h-screen flex-col">
					<HeaderWithSearch />

					{/* ✅ Parallax Hero Section */}
					<ParallaxBackground
						title="Your Journey Begins!"
						description="Welcome to Epic News, where the latest developments in tech are found."
					/>

					<FooterMenuRight />
				</div>
			</Document>
		</ParallaxProvider>
	)
}
