import { type LinksFunction } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react' // Import Outlet
import { ParallaxProvider } from 'react-scroll-parallax'
import { HoneypotProvider } from 'remix-utils/honeypot/react'
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react'
import Document from '~/components/shared-layout/Document'
import { useNonce } from '~/utils/nonce-provider.ts'
import rootLinkElements from '~/utils/providers/rootLinkElements'
import { type loader } from './__root.server.tsx'
import FooterMenuRight from './components/organisms/Footer/FooterMenuRight.tsx'
import HeaderWithSearch from './components/organisms/HeaderWithSearch' // Ensure loader is exported from this file

export const links: LinksFunction = () => {
	return rootLinkElements
}
export { headers, meta } from './__root.client.tsx'
export { action, loader } from './__root.server.tsx' // Import the loader type for useLoaderData

export default function App() {
	const data = useLoaderData<typeof loader>()
	const nonce = useNonce()

	return (
		<AuthenticityTokenProvider token={data.csrfToken}>
			<HoneypotProvider {...data.honeyProps}>
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
			</HoneypotProvider>
		</AuthenticityTokenProvider>
	)
}
