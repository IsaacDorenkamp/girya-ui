import type { Route } from "./+types/lifts";
import Lifts from "../views/lifts";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lifts" },
    { name: "description", content: "View available lifts." },
  ];
}

export default function Home() {
  return <Lifts />;
}
