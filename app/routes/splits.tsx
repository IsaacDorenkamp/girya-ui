import type { Route } from "./+types/login";
import Splits from "../views/splits";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Girya - Splits" },
    { name: "description", content: "View and manage splits." },
  ];
}

export default function Home() {
  return <Splits />;
}
