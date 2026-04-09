import type { Route } from "./+types/Login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login | Mursu Sushi" },
    { name: "description", content: "Log in to your Mursu Sushi account.", },
  ];
}

export default function Login() {
  return <h1>Login</h1>;
}
