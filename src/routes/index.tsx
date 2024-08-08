import { createFileRoute } from "@tanstack/react-router";
import FoodList from "../utils/FoodList";

export const Route = createFileRoute("/")({
  component: () => (
    <main className="">
      <em>
        <h1>Our Menu</h1>
      </em>

      <FoodList />
    </main>
  ),
});
