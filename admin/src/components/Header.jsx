import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
       <header className="flexCenter py-12 bg-white">
            {/** LOGO */}
            <Link to={'/'} className="flexCenter -top-6 left-0 right-0 w-full ">
                <img src="/logo.png" alt="" className="absolute -top-3 w-28 h-28 px-2 object-contain flexCenter"/>
            </Link>
       </header>
    )
}

export default Header;