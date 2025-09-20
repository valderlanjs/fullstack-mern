import { Link } from "react-router-dom";


const TreeCard = ({ image, title, subtitle }) => {
  return (
    <Link
      to={'/collection'}
      className="relative flex items-end justify-center h-96 w-full rounded-xl overflow-hidden shadow-md group"
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-all duration-500"
      />
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 text-white text-center p-4">
        <h4 className="text-4xl font-bold text-[#fff] line-clamp-1">{title}</h4>
        {subtitle && <p className="text-2xl text-[#D1F0C0] line-clamp-2">{subtitle}</p>}
      </div>
    </Link>
  );
};

export default TreeCard;
