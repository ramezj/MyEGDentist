import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin,
  Phone,
  Building2,
  Stethoscope,
  Clock,
  Languages,
  Briefcase,
  UserCog,
  ExternalLink,
  BriefcaseMedical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Separator } from "#/components/ui/separator";
import { dentistMeQuery } from "#/queries/dentists";
import { StatCard, Detail } from "#/components/dentist/stat-card";
import { PageLayout, LoadingLayout } from "#/components/shared/page-layout";

export const Route = createFileRoute("/dentist/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(dentistMeQuery),
  component: RouteComponent,
});

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

  return (
    <PageLayout
      variant="header"
      title="Overview"
      primaryButton={
        <Button asChild>
          <Link to="/dentist/profile">
            <UserCog />
            Edit Profile
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 text-lg">
                <AvatarImage src={profile.user.image ?? undefined} />
                <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                  {abbr}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">
                  Welcome back, Dr. {profile.user.name}
                </h2>
                <p className="text-muted-foreground text-sm mt-0.5">
                  {profile.clinicName} &middot; {profile.city} &middot;{" "}
                  {profile.specialty}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Services Listed"
            value={profile.services.length}
            icon={BriefcaseMedical}
          />
          <StatCard
            label="Languages"
            value={profile.languages.length}
            icon={Languages}
          />
          <StatCard
            label="Inquiries"
            value={0}
            icon={Briefcase}
            sub="Coming soon"
          />
          <StatCard
            label="Profile Views"
            value={0}
            icon={ExternalLink}
            sub="Coming soon"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.bio && (
                <>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {profile.bio}
                  </p>
                  <Separator />
                </>
              )}

              <div className="grid sm:grid-cols-2 gap-3">
                <Detail
                  icon={Stethoscope}
                  label="Specialty"
                  value={profile.specialty}
                />
                <Detail icon={MapPin} label="City" value={profile.city} />
                {profile.experience && (
                  <Detail
                    icon={Clock}
                    label="Experience"
                    value={profile.experience}
                  />
                )}
                {profile.phone && (
                  <Detail icon={Phone} label="Phone" value={profile.phone} />
                )}
                {profile.address && (
                  <Detail
                    icon={Building2}
                    label="Address"
                    value={profile.address}
                    className="sm:col-span-2"
                  />
                )}
              </div>

              {profile.languages.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Languages
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.languages.map((l) => (
                        <Badge key={l} variant="secondary">
                          {l}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {profile.services.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Services
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.services.map((s) => (
                        <Badge key={s.name} variant="outline">
                          {s.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <Link to="/dentist/profile">
                  <UserCog className="w-4 h-4" />
                  Edit Profile
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <a href="/" target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  View Public Listing
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
