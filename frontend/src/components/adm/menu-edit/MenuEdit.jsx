import { useState } from "react";

import Button from "../../shared/button/Button";

import IngredientsPanel from "./ingredientsPanel";
import DishesPanel from "./dishesPanel";

import "./menu-edit.css";

export default function MenuEdit() {
  const [view, setView] = useState("ingredients");

  return (
    <main className="menu-edit">

      {/* TITLE */}
      <h1 className="menu-edit__title">
        Menu Editor
      </h1>

      {/* TOGGLE */}
      <div className="menu-edit__toggle">
        <Button
          variant={view === "ingredients" ? "accent" : "dark"}
          onClick={() => setView("ingredients")}
          className="menu-edit__toggle-btn"
        >
          Ingredients
        </Button>

        <Button
          variant={view === "dishes" ? "accent" : "dark"}
          onClick={() => setView("dishes")}
          className="menu-edit__toggle-btn"
        >
          Dishes
        </Button>
      </div>

      {/* CONTENT */}
      <div className="menu-edit__content">
        {view === "ingredients" && <IngredientsPanel />}
        {view === "dishes" && <DishesPanel />}
      </div>

    </main>
  );
}
