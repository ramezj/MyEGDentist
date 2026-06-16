import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["home"],
    queryFn: async () => {},
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div className="p-8">{JSON.stringify(data)}</div>;
}
