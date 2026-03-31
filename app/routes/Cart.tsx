import type { Route } from "./+types/Cart";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cart | Mursu Sushi" },
    { name: "description", content: "View and manage your items in the shopping cart.", },
  ];
}

export default function Cart() {
  return <h1>Cart</h1>;
}