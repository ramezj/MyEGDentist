import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "#/components/ui/button";
import { authClient } from "#/lib/auth-client";
import { sessionQuery, useSession } from "#/lib/session";

export function Navbar() {
  const { data: user = null } = useSession();
  const queryClient = useQueryClient();

  function signOut() {
    void authClient.signOut({
      fetchOptions: {
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: sessionQuery.queryKey }),
      },
    });
  }

  return (
    <header className="border-b bg-background sticky top-0 z-10">
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
                  <Link to="/bookings">My Bookings</Link>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign out
              </Button>
            </>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
