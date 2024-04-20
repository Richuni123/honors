import { type LinksFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import Document from '~/components/shared-layout/Document'
import ThemeSwitch from '~/components/shared-layout/ThemeSwitch'
import { useNonce } from '~/utils/nonce-provider.ts'
import rootLinkElements from '~/utils/providers/rootLinkElements'
import { loader } from './__root.server'
import useTheme from './hooks/useTheme.tsx'

export const links: LinksFunction = () => {
	return rootLinkElements
}
export { headers, meta } from './__root.client.tsx'
export { action, loader } from './__root.server.tsx'

export default function App() {
	const data = useLoaderData<typeof loader>()
	const nonce = useNonce()
	const theme = useTheme()

	return (
		<Document nonce={nonce} theme={theme}>
			<div className="flex h-screen flex-col justify-between">
				<div className="flex-1">
					<main className="grid h-full place-items-center">
						<h1 className="text-mega">Welcome to Epic News!</h1>
					</main>
				</div>

				<div className="container flex justify-between pb-5">
					<ThemeSwitch userPreference={data.requestInfo.userPrefs.theme} />
				</div>
			</div>
		</Document>
	)
}
