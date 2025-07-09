import type { Route } from "./+types/home";
import Dashboard from "../views/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Girya - Dashboard" },
    { name: "description", content: "Girya Dashboard" },
  ];
}

export default function DashboardRoute() {
  return <Dashboard />;
}
