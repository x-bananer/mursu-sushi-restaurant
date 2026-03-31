import type { Route } from "./+types/ComboBuilder";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Combo Builder | Mursu Sushi" },
    { name: "description", content: "Create your custom sushi combo with our easy-to-use builder.", },
  ];
}

export default function ComboBuilder() {
  return <h1>Combo Builder</h1>;
}