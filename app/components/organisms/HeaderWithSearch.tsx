import { useMatches, Link } from '@remix-run/react'
import logo from '~/assets/png/logo.png'
import { SearchBar } from '../molecules/SearchBar'
import LoginOrUserDropdown from './LoginOrUserDropdown'

export default function HeaderWithSearch() {
	const matches = useMatches()
	const isOnSearchPage = matches.find(m => m.id === 'routes/users+/index')
	const searchBar = isOnSearchPage ? null : <SearchBar status="idle" />

	return (
		<header className="dark:bg-dark-primary/10 bg-primary/10 py-6">
			<nav className="container flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:gap-8">
				{/* LOGO */}
				<Link to="/" className="flex items-center">
					<img
						src={logo}
						alt="Shoot Your Best Score Logo"
						className="h-24 w-auto"
					/>
				</Link>

				<div className="flex flex-1 justify-center gap-8">
					<Link
						to="/about-us"
						prefetch="intent"
						className="text-sm font-semibold text-muted-foreground transition hover:text-foreground"
					>
						Main
					</Link>
				</div>

				{/* SEARCH BAR (desktop) */}
				<div className="ml-auto hidden max-w-sm flex-1 sm:block">
					{searchBar}
				</div>

				{/* USER MENU */}
				<div className="flex items-center gap-10">
					<LoginOrUserDropdown />
				</div>

				{/* SEARCH BAR (mobile) */}
				<div className="block w-full sm:hidden">{searchBar}</div>
			</nav>
		</header>
	)
}
