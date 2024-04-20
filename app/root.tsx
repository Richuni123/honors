import { type LinksFunction } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react'
import { HoneypotProvider } from 'remix-utils/honeypot/react'
import Document from '~/components/shared-layout/Document'
import ThemeSwitch from '~/components/shared-layout/ThemeSwitch'
import { useNonce } from '~/utils/nonce-provider.ts'
import rootLinkElements from '~/utils/providers/rootLinkElements'
import { loader as rootLoader } from './__root.server.tsx'
import { EpicProgress } from './components/molecules/ProgressBar'
import { EpicToaster } from './components/molecules/Sonner'
import FooterMenuRight from './components/organisms/Footer/FooterMenuRight'
import HeaderWithSearch from './components/organisms/HeaderWithSearch'
import { useToast } from './components/toaster'
import useTheme from './hooks/useTheme'

export const links: LinksFunction = () => {
	return rootLinkElements
}
export { headers, meta } from './__root.client.tsx'
export { action, loader } from './__root.server.tsx'

export default function App() {
	const data = useLoaderData<typeof rootLoader>()
	const nonce = useNonce()
	const theme = useTheme()

	useToast(data.toast)

	return (
		<AuthenticityTokenProvider token={data.csrfToken}>
			<HoneypotProvider {...data.honeyProps}>
				<Document nonce={nonce} theme={theme}>
					<div className="flex h-screen flex-col justify-between">
						<HeaderWithSearch />

						<div className="flex-1">
							<Outlet />
						</div>
						<div className="container flex justify-between pb-5">
							<ThemeSwitch userPreference={data.requestInfo.userPrefs.theme} />
						</div>

						<EpicToaster closeButton position="top-center" theme={theme} />
						<EpicProgress />
						<FooterMenuRight />
					</div>
				</Document>
			</HoneypotProvider>
		</AuthenticityTokenProvider>
	)
}
