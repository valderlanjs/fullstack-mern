import React from "react";
import { Link } from "react-router-dom";

const Item = ({ product }) => {
  return (
    <div className="ring-1 ring-slate-900/5 rounded-xl bg-white overflow-hidden">
      <Link to={`/product/${product._id}`} className="flexCenter relative">
        <img src={product.image[0]} alt="productImg" />
      </Link>
      <div className="p-3">
        <h4 className="h4 line-clamp-1 flexCenter !my-0">{product.name}</h4>
        <div className="felxBetween pt-1">
          <p className="font-bold flexCenter">{product.category}</p>
        </div>
      </div>
    </div>
  );
};

export default Item;
