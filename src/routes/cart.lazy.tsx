/* eslint-disable react-hooks/rules-of-hooks */
import { createLazyFileRoute } from "@tanstack/react-router";
import Cart from "../components/Cart";
import { useState } from "react";
import { useAtom } from "jotai";
import {
  transactionTime as transactionTimeAtom,
  totalCost,
  cartList,
} from "../context/cartContext"; // Renamed the import
import { sendTransaction, getAllTransactionIds } from "../utils/Transactions";

export const Route = createLazyFileRoute("/cart")({
  component: () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogOpenConfirm, setDialogOpenConfirm] = useState(false);

    const [transactionTime, setTransactionTime] = useAtom<Date | string>(transactionTimeAtom); // Updated to use the renamed import
    const [tCost, setTCost] = useAtom<number>(totalCost);
    const [cList, __] = useAtom(cartList);
    const cartNames: string[] = cList.map((item) => item.name);
    const [transactionId, setTransactionId] = useState(""); // State to store the transaction ID

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    };

    const handleCheckOut = async () => {
      const existingIds = await getAllTransactionIds();
      let newId;
      do {
        newId = Math.random().toString(36).substring(2, 12);
      } while (existingIds.includes(newId));

      setTransactionTime(new Date().toLocaleTimeString());
      setTransactionId(newId); // Set the new transaction ID
      setDialogOpen(false);
      setDialogOpenConfirm(true);

      sendTransaction({
        id: transactionId,
        time: transactionTime,
        cost: tCost,
        items: cartNames.join(", ").split(","),
        notes: "",
      });
    };

    const handleDialog = () => {
      setDialogOpen(!dialogOpen);
    };

    return (
      <main>
        <h1>Cart</h1>
        <Cart />
        <button
          onClick={handleDialog}
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          CheckOut
        </button>
        {dialogOpen && (
          <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <h1>Checkout </h1>
            <p>Are you sure you want these items:</p>
            <br />
            <button
              onClick={() => handleCheckOut()}
              className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Confirm
            </button>
          </div>
        )}
        {dialogOpenConfirm && (
          <div>
            <h1>Reciept</h1>
            <p>Transaction Id: {transactionId}</p>
            <p>Time: {transactionTime}</p>
            <p>Items: {cartNames.join(", ")}</p>
            <p>Cost:{formatCurrency(tCost)} </p>
          </div>
        )}
      </main>
    );
  },
});
