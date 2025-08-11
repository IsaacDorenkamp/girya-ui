import type { Route } from "./+types/login";
import Workouts from "../views/workouts";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Girya - Workouts" },
    { name: "description", content: "View workouts." },
  ];
}

export default function Home() {
  return <Workouts />;
}
