import { useMutation } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { useAtom } from "jotai";

import { cartList } from "../context/cartContext";
import { useState } from "react";

interface TransactionType {
  id: string;
  time: Date | string; // Assuming time is a string, correct the type as necessary
  cost: number;
  items: string[];
  notes: string;
  // Add other fields as per your table structure
}

export async function getAllTransactionIds() {
  const { data, error } = await supabase.from("Transaction").select("id");

  if (error) throw new Error(error.message);
  return data.map((transaction) => transaction.id); // Returns an array of all transaction IDs
}

export async function sendTransaction(transaction: TransactionType) {
  const { data, error } = await supabase.from("Transaction").insert([transaction]);
  console.log("sent: " + data);
  if (error) throw new Error(error.message);
  return data;
}
