import { useAtom } from "jotai";
import { cartList, totalCost } from "../context/cartContext";
import trashIcon from "../assets/Trash icon.svg";

export default function Cart() {
  const [cList, setCList] = useAtom(cartList);
  const [tCost, setTotalCost] = useAtom(totalCost);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const deleteItem = (itemID: number, itemCost: number) => {
    console.log("Deleting item ID:", itemID); // Debug log for tracking which item is being deleted

    // Filter out the item with the specified ID
    const updatedList = cList.filter((item) => item.id !== itemID);
    // Update the cart list state with the new list
    setCList(updatedList);

    // Calculate the new total cost after item deletion
    const updatedCost = tCost - itemCost;
    // Update the total cost state
    setTotalCost(updatedCost);
  };

  return (
    <div className=" flex flex-col w-full justify-center gap-8 ">
      {cList.map((item) => (
        <div key={item.id} className="flex justify-evenly ">
          <div className=" w-48">{item.name}</div>
          <div className="w-10"> {formatCurrency(item.cost)}</div>
          <button onClick={() => deleteItem(item.id, item.cost)} className=" w-9 p-2 rounded">
            <img src={trashIcon} alt="trash" />
          </button>
        </div>
        // Assuming each item has 'id' and 'name' properties
      ))}
      <hr />
      <div className="flex justify-evenly ">Total: {formatCurrency(tCost)}</div>
    </div>
  );
}
