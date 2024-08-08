import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: () => <main>Hello /login!</main>,
});
