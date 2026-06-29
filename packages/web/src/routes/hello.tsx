import { createFileRoute } from "@tanstack/react-router";

import { HelloPage } from "../components/hello-page";

export const Route = createFileRoute("/hello")({
  component: HelloPage,
});
