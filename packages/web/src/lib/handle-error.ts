import { toast } from "sonner";
import { ClientApiError } from "#/lib/api-error";

export function handleApiError(err: unknown, fallback = "Something went wrong") {
  if (!(err instanceof ClientApiError)) {
    toast.error(fallback);
    return;
  }

  switch (err.code) {
    case "NOT_FOUND":
      toast.error(err.message);
      break;
    case "FORBIDDEN":
    case "UNAUTHORIZED":
      toast.error("You don't have permission to do that");
      break;
    case "BAD_REQUEST":
    case "CONFLICT":
      toast.error(err.message);
      break;
    default:
      toast.error(fallback);
  }
}
