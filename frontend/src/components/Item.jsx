import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { animationVariants } from "../constants/animationVariants";

const Item = ({ product }) => {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      variants={animationVariants.zoomIn}
      viewport={{ once: true, amount: 0.2 }}
      className="ring-1 ring-slate-900/5 rounded-xl bg-white overflow-hidden"
    >
      <Link to={type === "product" ? `/product/${data._id}` : `/contact/${data._id}`} className="flexCenter relative">
        <img
          src={product.image[0]}
          alt="productImg"
          className="h-48 w-full object-cover hover:transform object-center hover:scale-105 transition-all duration-500"
        />
      </Link>

      <div className="p-3">
        <h4 className="h4 line-clamp-1 flexCenter !my-0">{product.name}</h4>
        <div className="felxBetween pt-1">
          <p className="font-bold flexCenter">{product.category}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Item;
