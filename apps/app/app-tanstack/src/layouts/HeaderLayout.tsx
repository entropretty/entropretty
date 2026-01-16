import { EntroprettyLogo } from '@/components/EntroprettyLogo'
import { HelpMenu } from '@/components/HelpMenu'
import { DiscordIcon } from '@/components/icons/DiscordIcon'
import { XIcon } from '@/components/icons/XIcon'
import { NewDialog } from '@/components/NewDialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useTheme } from '@/contexts/theme-context'
import { useUserProfile } from '@/hooks/useUserProfile'
import { FEATURES } from '@/lib/features'
import { cn } from '@/lib/utils'
import { Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { Moon, Sun } from 'lucide-react'

function HeaderLogo({ pathname }: { pathname: string }) {
  // const randomFavicon = useMemo(() => Math.floor(Math.random() * 45) + 1, [])

  return (
    <Link to={'/'} className="hidden sm:flex pr-2">
      {/* <img
        src={`/favicon/${randomFavicon}.png`}
        alt="favicon"
        className="h-10 w-10 hidden sm:block"
      /> */}
      <EntroprettyLogo className="hidden lg:flex" />
    </Link>
  )
}

export default function HeaderLayout() {
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { data: profile, isLoading: isLoadingProfile } = useUserProfile()

  // On algorithm detail pages, let the nav scroll out of view
  const isAlgorithmPage = location.pathname.startsWith('/a/')

  return (
    <div id="main-scroll-container" className="flex h-screen w-screen flex-col relative overflow-y-scroll">
      <nav className={cn(
        "z-20 border-border border-b flex flex-row items-center justify-between gap-2 px-0 sm:px-6 py-2 sm:py-5 backdrop-blur-md",
        !isAlgorithmPage && "sticky top-0"
      )}>
        <div className="flex flex-1 flex-row items-center justify-around md:justify-between gap-2">
          <HeaderLogo pathname={location.pathname} />
          {!FEATURES.isCompetition && (
            <>
              <Button asChild variant={'link'}>
                <Link to="/explore">explore</Link>
              </Button>
              <Button
                asChild
                variant={'link'}
                className={cn(
                  (location.pathname === '/new' || location.pathname === '/') &&
                    'underline',
                )}
              >
                <Link to="/new">new</Link>
              </Button>

              <Button
                asChild
                variant={'link'}
                className={cn(location.pathname === '/hot' && 'underline')}
              >
                <Link to="/hot">hot</Link>
              </Button>
            </>
          )}

          {user && (
            <Button
              asChild
              variant={'link'}
              className={cn(location.pathname === '/mine' && 'underline')}
            >
              <Link to="/mine">mine</Link>
            </Button>
          )}
          <HelpMenu />
          <Button asChild variant={'link'} className="h-5 w-5">
            <a
              href="https://x.com/entropretty"
              target="_blank"
              rel="noreferrer"
            >
              <XIcon className="h-5 w-5 fill-current" />
            </a>
          </Button>
          {FEATURES.isCompetition && (
            <>
              <Button asChild variant={'link'} className="h-5 w-5">
                <a
                  href="https://discord.com/invite/x73PxY95BZ"
                  target="_blank"
                  rel="noreferrer"
                >
                  <DiscordIcon className="h-5 w-5 fill-current" />
                </a>
              </Button>
              <span className="text-muted-foreground -ml-1 hidden text-xs md:inline">
                #entropretty-compo-2025
              </span>
            </>
          )}
        </div>

        <div className="flex-1 hidden lg:flex flex-row items-center justify-end gap-2">
          {FEATURES.isCompetition && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          )}
          {!user && (
            <>
              <Button className="hidden md:block" asChild>
                <Link to="/login">LOGIN</Link>
              </Button>
              <Button variant={'ghost'} className="hidden md:block" asChild>
                <Link to="/signup">SIGN UP</Link>
              </Button>
            </>
          )}
          {user && (
            <>
              {!isLoadingProfile && (
                <Button variant="ghost" asChild>
                  <Link to="/profile">{profile?.username || user.email}</Link>
                </Button>
              )}
              {location.pathname !== '/create' && <NewDialog />}
              <Button
                variant={'ghost'}
                onMouseDown={() => {
                  signOut()
                    .then(() => {
                      navigate({ to: '/' })
                    })
                    .catch((e) => {
                      console.error(e)
                    })
                }}
              >
                LOGOUT
              </Button>
            </>
          )}
        </div>
      </nav>
      <main className="relative flex h-full w-full flex-col items-center">
        <Outlet />
      </main>
    </div>
  )
}
