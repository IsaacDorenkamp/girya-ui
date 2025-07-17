import type { Route } from "./+types/lifts";
import Lifts from "../views/lifts";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Girya - Lifts" },
    { name: "description", content: "View and manage lifts." },
  ];
}

export default function Home() {
  return <Lifts />;
}
