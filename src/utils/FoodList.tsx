import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { useAtom } from "jotai";

import { cartList } from "../context/cartContext";
import { useState } from "react";

interface FoodType {
  id: number;
  name: string;
  cost: number;
  image: string;
  description: string;
  category: string;
  // Add other fields as per your table structure
}

export default function FoodTable() {
  const [cList, setCList] = useAtom(cartList);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // State to hold the selected category

  const { data, error, isLoading } = useQuery({
    queryKey: ["foodData"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Food") // Replace with your actual table name
        .select("*");

      if (error) throw new Error(error.message);
      return data;
    },
  });
  if (error) {
    throw new Error(error.message);
  }

  if (isLoading) {
    return (
      <div>
        <div className="loader" />
        <p>Loading...</p>
      </div>
    );
  }

  // Group data by category (assuming unique categories and no empty categories)
  const foodByCategory = data
    ? data.reduce<Record<string, FoodType[]>>((acc, foodItem) => {
        const category = foodItem.category;
        acc[category] = acc[category] || [];
        acc[category].push(foodItem);
        return acc;
      }, {})
    : {};

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const AddToCart = (itemName: string, itemCost: number) => {
    const uniqueId = Date.now(); // Using the current timestamp to ensure uniqueness
    setCList([...cList, { id: uniqueId, name: itemName, cost: itemCost }]);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <>
      <select onChange={handleCategoryChange} value={selectedCategory || ""}>
        <option value="">All Categories</option>
        {Object.keys(foodByCategory).map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {Object.entries(foodByCategory).map(([category, items]) => {
        if (!selectedCategory || selectedCategory === category) {
          return (
            <div key={category} className="my-4">
              <h1 className=" my-1">{category}</h1>
              <div className="grid grid-cols-2 gap-1">
                {items.map((item: FoodType) => (
                  <div key={item.id} className="flex gap-1 h-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="rounded-lg object-cover h-full w-2/5"
                    />
                    <div className="">
                      <h2>{item.name}</h2>
                      <h2>{formatCurrency(item.cost)}</h2>
                      <p>{item.description}</p>
                      <button onClick={() => AddToCart(item.name, item.cost)}>Add</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        return null;
      })}
    </>
  );
}
