import type { Route } from "./+types/login";
import Login from "../views/auth/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
    { name: "description", content: "Log in to Girya." },
  ];
}

export default function Home() {
  return <Login />;
}
