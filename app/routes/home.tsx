import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Girya" },
    { name: "description", content: "Girya - Home" },
  ];
}

export default function Home() {
	return <div className="text-center">
		<h1>Girya</h1>
		<Link to="/dashboard">Go to Dashboard</Link>
	</div>;
}
