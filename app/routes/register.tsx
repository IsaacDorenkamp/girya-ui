import type { Route } from "./+types/login";
import Register from "../views/auth/register";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register" },
    { name: "description", content: "Register with Girya." },
  ];
}

export default function Home() {
  return <Register />;
}
