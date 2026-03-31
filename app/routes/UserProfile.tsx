import type { Route } from "./+types/UserProfile";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "User Profile | Mursu Sushi" },
    { name: "description", content: "Manage your Mursu Sushi user profile and preferences.", },
  ];
}

export default function UserProfile() {
  return <h1>User Profile</h1>;
}