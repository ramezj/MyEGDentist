import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "#/components/ui/button";
import { authClient } from "#/lib/auth-client";
import { sessionQuery, useSession } from "#/lib/session";

export function Navbar() {
  const { data: user = null } = useSession();
  const queryClient = useQueryClient();
  return (
    <header className="border-b bg-background">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-sm">
          MyEGDentist
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {user.type === "dentist" && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dentist">Dashboard</Link>
                </Button>
              )}
              {user.type === "tourist" && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dentist">Dashboard</Link>
                </Button>
              )}
              {user.type === "agency" && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dentist">Dashboard</Link>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => void authClient.signOut({ fetchOptions: { onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionQuery.queryKey }) } })}
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
