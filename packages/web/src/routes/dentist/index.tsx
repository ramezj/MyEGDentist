import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin,
  UserCog,
  ExternalLink,
  CalendarDays,
  Tag,
  CheckCircle2,
  Circle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Progress } from "#/components/ui/progress";
import { Separator } from "#/components/ui/separator";
import { dentistMeQuery, isAvailability } from "#/queries/dentists";
import { PageLayout, LoadingLayout } from "#/components/shared/page-layout";

export const Route = createFileRoute("/dentist/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(dentistMeQuery),
  component: RouteComponent,
});

const QUICK_LINKS = [
  {
    label: "View appointments",
    to: "/dentist/appointments",
    icon: CalendarDays,
  },
  { label: "Manage services", to: "/dentist/services", icon: Tag },
  { label: "Edit profile", to: "/dentist/profile", icon: UserCog },
];

function RouteComponent() {
  const { data: profile, isLoading } = useQuery(dentistMeQuery);

  if (isLoading) return <LoadingLayout title="Dashboard" />;
  if (!profile) return null;

  const abbr = profile.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const completenessItems = [
    { label: "Bio", done: !!profile.bio },
    { label: "Phone number", done: !!profile.phone },
    { label: "Clinic address", done: !!profile.address },
    { label: "Languages", done: profile.languages.length > 0 },
    { label: "Services listed", done: profile.services.length > 0 },
    {
      label: "Availability set",
      done:
        isAvailability(profile.availability) &&
        profile.availability.days.length > 0,
    },
  ];
  const doneCount = completenessItems.filter((i) => i.done).length;
  const completeness = Math.round((doneCount / completenessItems.length) * 100);
  const missing = completenessItems.filter((i) => !i.done);

  return (
    <PageLayout
      variant="header"
      title={`Dr. ${profile.user.name}`}
      primaryButton={
        <Button asChild>
          <Link to="/dentist/profile">
            <UserCog />
            Edit Profile
          </Link>
        </Button>
      }
    >
      <div className="space-y-5 max-w-4xl">
        {/* Profile summary */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <Avatar className="h-14 w-14 shrink-0 text-base">
                  <AvatarImage src={profile.user.image ?? undefined} />
                  <AvatarFallback className="bg-primary/15 text-primary font-semibold">
                    {abbr}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-semibold text-base leading-tight">
                    {profile.clinicName}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{profile.city}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Badge variant="secondary" className="font-normal">
                      {profile.specialty}
                    </Badge>
                    {profile.experience && (
                      <Badge variant="outline" className="font-normal">
                        {profile.experience}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Button asChild size="sm">
                  <Link to="/dentist/profile">
                    <UserCog className="w-3.5 h-3.5 mr-1.5" />
                    Edit Profile
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <a href="/" target="_blank" rel="noreferrer">
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    View Listing
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0">
              {[
                { label: "Services", value: profile.services.length },
                { label: "Languages", value: profile.languages.length },
                { label: "Bookings", value: "—" },
                { label: "Profile views", value: "—" },
              ].map(({ label, value }) => (
                <div key={label} className="p-5">
                  <p
                    className={`text-2xl font-bold tabular-nums ${value === "—" ? "text-muted-foreground/40" : ""}`}
                  >
                    {value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom row */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Profile completeness */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Profile Completeness
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {doneCount} of {completenessItems.length} complete
                  </span>
                  <span className="font-medium">{completeness}%</span>
                </div>
                <Progress value={completeness} />
              </div>

              <div className="space-y-2">
                {completenessItems.map(({ label, done }) => (
                  <div key={label} className="flex items-center gap-2 text-sm">
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                    )}
                    <span
                      className={
                        done ? "text-muted-foreground line-through" : ""
                      }
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {missing.length > 0 && (
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full mt-2"
                >
                  <Link to="/dentist/profile">
                    Complete your profile
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Quick links */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Links</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-2 divide-y">
              {QUICK_LINKS.map(({ label, to, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center justify-between py-3 text-sm hover:text-primary transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-muted group-hover:bg-primary/10 transition-colors">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    {label}
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
