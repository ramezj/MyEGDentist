import { authClient } from '#/lib/auth-client'
import { Button } from '#/components/ui/button'

export default function BetterAuthHeader() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          {session.user.image ? (
            <img src={session.user.image} alt="" className="h-8 w-8 rounded-full" />
          ) : (
            <span className="text-xs font-medium text-muted-foreground">
              {session.user.name?.charAt(0).toUpperCase() ?? 'U'}
            </span>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => void authClient.signOut()}>
          Sign out
        </Button>
      </div>
    )
  }

  return null
}
