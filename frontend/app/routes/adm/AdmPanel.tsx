import type { Route } from "../adm/+types/AdmPanel";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Panel | Mursu Sushi" },
    { name: "description", content: "Manage your Mursu Sushi restaurant with the admin panel.", },
  ];
}

export default function AdmPanel() {
  return <h1>Admin Panel</h1>;
}