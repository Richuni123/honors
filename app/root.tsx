import { type LinksFunction } from '@remix-run/node'
import Document from '~/components/shared-layout/Document'
import { useNonce } from '~/utils/nonce-provider.ts'
import rootLinkElements from '~/utils/providers/rootLinkElements'
import FooterMenuRight from './components/organisms/Footer/FooterMenuRight.tsx'
import HeaderWithSearch from './components/organisms/HeaderWithSearch'

export const links: LinksFunction = () => {
	return rootLinkElements
}
export { headers, meta } from './__root.client.tsx'
export { action, loader } from './__root.server.tsx'

export default function App() {
	const nonce = useNonce()

	return (
		<Document nonce={nonce}>
			<div className="flex h-screen flex-col">
				<HeaderWithSearch />
				{/* Navbar */}

				{/* Hero Section */}
				<section className="relative h-[60vh] w-full overflow-hidden">
					<img
						src="/img/hero_image.png"
						alt="Golf Hero"
						className="absolute inset-0 h-full w-full object-cover"
					/>
					<div className="relative z-10 flex h-full items-center justify-center bg-black bg-opacity-40 text-white">
						<div className="px-4 text-center">
							<h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
								Your Journey Begins!
							</h1>
							<p className="mt-4 text-lg sm:text-xl lg:text-2xl">
								Welcome to Epic News, where the latest developments in tech are
								found.
							</p>
						</div>
					</div>
				</section>
				<FooterMenuRight />
			</div>
		</Document>
	)
}
