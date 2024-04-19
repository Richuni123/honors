import { getUser } from '#server/user.server'
import { parseWithZod } from '@conform-to/zod'
import {
	json,
	type ActionFunctionArgs,
	type HeadersFunction,
	type LinksFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { Outlet, useLoaderData, type MetaFunction } from '@remix-run/react'
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react'
import { HoneypotProvider } from 'remix-utils/honeypot/react'
import { z } from 'zod'
import Document from '~/components/shared-layout/Document'
import ThemeSwitch from '~/components/shared-layout/ThemeSwitch'
import { getUserId, logout } from '~/utils/auth.server'
import { csrf } from '~/utils/csrf.server'
import { honeypot } from '~/utils/honeypot.server'
import { useNonce } from '~/utils/nonce-provider.ts'
import rootLinkElements from '~/utils/providers/rootLinkElements'
import { setTheme } from '~/utils/theme.server'
import { makeTimings, time } from '~/utils/timing.server'
import { getToast } from '~/utils/toast.server'
import { EpicProgress } from './components/molecules/ProgressBar'
import { EpicToaster } from './components/molecules/Sonner'
import FooterMenuRight from './components/organisms/Footer/FooterMenuRight'
import HeaderWithSearch from './components/organisms/HeaderWithSearch'
import { useToast } from './components/toaster'
import useTheme from './hooks/useTheme'
import generateRootJson from './utils/rootProviders/generateRootJson'
import { invariantResponse } from '@epic-web/invariant'

export const links: LinksFunction = () => {
	return rootLinkElements
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: data ? 'Epic News' : 'Error | Epic News' },
		{ name: 'description', content: `Your own captain's log` },
	]
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
	const headers = {
		'Server-Timing': loaderHeaders.get('Server-Timing') ?? '',
	}
	return headers
}

export async function loader({ request }: LoaderFunctionArgs) {
	const timings = makeTimings('root loader')
	const userId: string | null = await time(() => getUserId(request), {
		timings,
		type: 'getUserId',
		desc: 'getUserId in root',
	})

	const user = userId
		? await time(getUser(userId), {
				timings,
				type: 'find user',
				desc: 'find user in root',
			})
		: null

	if (userId && !user) {
		console.info('something weird happened')
		// something weird happened... The user is authenticated but we can't find
		// them in the database. Maybe they were deleted? Let's log them out.
		await logout({ request, redirectTo: '/' })
	}

	const { toast, headers: toastHeaders } = await getToast(request)
	const honeyProps = honeypot.getInputProps()
	const [csrfToken, csrfCookieHeader] = await csrf.commitToken()
	const { pageData, headerData } = generateRootJson({
		user,
		request,
		honeyProps,
		toast,
		csrfToken,
		timings,
		toastHeaders,
		csrfCookieHeader,
	})

	return json(pageData, headerData)
}

const ThemeFormSchema = z.object({
	theme: z.enum(['system', 'light', 'dark']),
})

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()
	const submission = parseWithZod(formData, {
		schema: ThemeFormSchema,
	})

	invariantResponse(submission.status === 'success', 'Invalid theme received')

	const { theme } = submission.value

	console.log({ theme })

	const responseInit = {
		headers: { 'set-cookie': setTheme(theme) },
	}
	return json({ result: submission.reply() }, responseInit)
}

export default function App() {
	const data = useLoaderData<typeof loader>()
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
