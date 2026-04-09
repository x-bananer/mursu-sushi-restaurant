import type { Route } from "../customer/+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mursu Sushi Restaurant | Fresh Sushi in Helsinki" },
    { name: "description", content: "Order fresh sushi, build your own combo, and track your delivery in real time with Mursu Sushi.", },
  ];
}

export default function Home() {
  return <h1>Home</h1>;
}
