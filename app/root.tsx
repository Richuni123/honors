import { type LinksFunction } from '@remix-run/node'
import { ParallaxProvider } from 'react-scroll-parallax'

import Document from '~/components/shared-layout/Document'
import { useNonce } from '~/utils/nonce-provider.ts'
import rootLinkElements from '~/utils/providers/rootLinkElements'
import FooterMenuRight from './components/organisms/Footer/FooterMenuRight.tsx'
import HeaderWithSearch from './components/organisms/HeaderWithSearch'

import { Outlet } from '@remix-run/react' // Import Outlet

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

					<main className="flex-1">
						<Outlet /> {/* This is where your index.tsx will be rendered */}
					</main>

					{/* Footer */}
					<FooterMenuRight />
				</div>
			</Document>
		</ParallaxProvider>
	)
}
