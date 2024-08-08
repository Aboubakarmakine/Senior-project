import { Link } from "@tanstack/react-router";
import CartIcon from "../assets/Shopping Cart Icon.svg";
import { useAtom } from "jotai";
import { cartCount } from "../context/cartContext";
import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

export default function NavBar() {
  const [cCount, setCCount] = useAtom(cartCount);
  const animationRef = useRef(null);
  const controls = useAnimation();

  const variants = {
    pulse: {
      scale: 1.1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    initial: {
      scale: 1.0,
    },
  };

  useEffect(() => {
    if (cCount > 0) {
      controls.start("pulse");
    }
  }, [cCount, controls]);

  return (
    <nav className="flex justify-between items-center my-8 gap-12  ">
      <div className="flex justify-between gap-20 flex-grow">
        <Link to="/" className="">
          Global Food
        </Link>

        <ul className="flex items-center list-none gap-3">
          <li>
            <Link to="/about" className="[&.active]:font-bold">
              About
            </Link>
          </li>
          <li>
            <Link to="/login" className="[&.active]:font-bold">
              Login
            </Link>
          </li>
        </ul>
      </div>

      <Link to="/cart" className="flex gap-2">
        <img src={CartIcon} className="cart-icon" alt="cart" />

        <motion.span
          ref={animationRef}
          animate={controls}
          variants={variants}
          className={`${cCount > 0 ? "text-red-900" : ""}`}
        >
          {cCount}
        </motion.span>
      </Link>
    </nav>
  );
}
