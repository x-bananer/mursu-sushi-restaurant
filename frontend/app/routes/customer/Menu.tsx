import type { Route } from "../customer/+types/Menu";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Menu | Mursu Sushi" },
    { name: "description", content: "Browse our sushi menu with vegan, gluten-free, and classic options.", },
  ];
}
export default function Menu() {
  return <h1>Menu</h1>;
}