import { Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { authClient } from "#/lib/auth-client";
import { useSession } from "#/lib/session";

export function Navbar() {
  const { data: user = null } = useSession();
  return (
    <header className="border-b bg-background">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-sm">
          MyEGDentist
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void authClient.signOut()}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/dentist-signup">Register as a Dentist</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
