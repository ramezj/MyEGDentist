import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { apiClient } from "#/lib/api-client";
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
import { Skeleton } from "#/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Separator } from "#/components/ui/separator";

type DentistProfile = {
  id: string;
  clinicName: string;
  specialty: string;
  city: string;
  phone: string | null;
  bio: string | null;
  experience: string | null;
  languages: string[];
  address: string | null;
  services: string[];
  user: { name: string; image: string | null; email: string };
};

const dentistProfileQuery = queryOptions({
  queryKey: ["dentist", "me"],
  queryFn: async (): Promise<DentistProfile> => {
    const res = await apiClient.dentists.me.$get();
    if (!res.ok) throw new Error("Failed to load profile");
    return res.json() as Promise<DentistProfile>;
  },
});

export const Route = createFileRoute("/dentist/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(dentistProfileQuery),
  component: RouteComponent,
});

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className="p-2 rounded-md bg-muted">
            <Icon className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OverviewSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Skeleton className="lg:col-span-2 h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  );
}

function RouteComponent() {
  const { data: profile, isLoading } = useQuery(dentistProfileQuery);

  if (isLoading) return <OverviewSkeleton />;
  if (!profile) return null;

  const initials = profile.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome banner */}
      <Card className="">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 text-lg">
              <AvatarImage src={profile.user.image ?? undefined} />
              <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">
                Welcome back, Dr. {profile.user.name}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {profile.clinicName} &middot; {profile.city} &middot;{" "}
                {profile.specialty}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stat tiles */}
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

      {/* Details + actions */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Profile details */}
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
              <Detail icon={Stethoscope} label="Specialty" value={profile.specialty} />
              <Detail icon={MapPin} label="City" value={profile.city} />
              {profile.experience && (
                <Detail icon={Clock} label="Experience" value={profile.experience} />
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
                      <Badge key={s} variant="outline">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start gap-2">
              <Link to="/dentist/profile">
                <UserCog className="w-4 h-4" />
                Edit Profile
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start gap-2">
              <a href="/" target="_blank" rel="noreferrer">
                <ExternalLink className="w-4 h-4" />
                View Public Listing
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-2 ${className ?? ""}`}>
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}