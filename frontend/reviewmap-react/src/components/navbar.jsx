import React from "react";
import logo from "../static/images/CoffeeBear.png";

const NavbarComponent = () => {
  return (
    <nav className="bg-primary text-white h-[50px]">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <div className="flex items-center">
          <a href="/home" className="text-white hover:text-gray-200 transition-colors">
            Home
          </a>
        </div>
        <div className="flex items-center">
          <a href="/home" className="flex items-center text-white hover:text-gray-200 transition-colors">
            <span className="font-bold mr-2">Adventure Bear</span>
            <img
              alt="Adventure Bear Logo"
              src={logo}
              width="30"
              height="30"
              className="inline-block"
            />
          </a>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            className="bg-secondary hover:bg-opacity-90 text-white px-4 py-2 rounded transition-colors"
          >
            + Add Location
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
