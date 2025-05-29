import React, { useState, useEffect } from "react";
import { LayoutDashboard, Milestone, User, MessageSquare } from "lucide-react";
import { useAuthContext } from "../../hook/useAuthContext";
import { useLocation, Link } from "react-router-dom";

const NavBar = () => {
  const { user } = useAuthContext();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("dashboard");

  // Update active item based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/admin/posts")) {
      setActiveItem("posts");
    } else if (path.includes("/admin/users")) {
      setActiveItem("users");
    } else if (path.includes("/admin/comments")) {
      setActiveItem("comments");
    } else {
      setActiveItem("dashboard");
    }
  }, [location]);

  return (
    <div className="bg-my-primary w-64 h-screen fixed border-r-2 border-gray-300 flex flex-col">
      <div className="logo flex justify-center items-center gap-3 p-5">
        <div className="bg-white inline-block p-2 rounded-xl">
          <img src="/KM.svg" alt="" className="w-8" />
        </div>
        <h1 className="text-xl text-white font-bold">Kea Meng's Blog</h1>
      </div>
      <div className="border-b border-gray-300"></div>

      <h1 className="font-bold m-5 mt-6 text-white text-md">MAIN NAVIGATION</h1>

      <ul className="flex-grow">
        <li>
          <Link
            to="/admin"
            className={`flex items-center gap-3 p-4 mx-4 my-1 ${
              activeItem === "dashboard"
                ? "bg-white text-my-primary rounded-lg"
                : "text-white hover:bg-white hover:text-my-primary hover:rounded-lg"
            } cursor-pointer`}
          >
            <LayoutDashboard size={24} /> Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/admin/posts"
            className={`flex items-center gap-3 p-4 mx-4 my-1 ${
              activeItem === "posts"
                ? "bg-white text-my-primary rounded-lg"
                : "text-white hover:bg-white hover:text-my-primary hover:rounded-lg"
            } cursor-pointer`}
          >
            <Milestone size={24} /> Posts
          </Link>
        </li>
        <li>
          <Link
            to="/admin/users"
            className={`flex items-center gap-3 p-4 mx-4 my-1 ${
              activeItem === "users"
                ? "bg-white text-my-primary rounded-lg"
                : "text-white hover:bg-white hover:text-my-primary hover:rounded-lg"
            } cursor-pointer`}
          >
            <User size={24} /> Users
          </Link>
        </li>
        <li>
          <Link
            to="/admin/comments"
            className={`flex items-center gap-3 p-4 mx-4 my-1 ${
              activeItem === "comments"
                ? "bg-white text-my-primary rounded-lg"
                : "text-white hover:bg-white hover:text-my-primary hover:rounded-lg"
            } cursor-pointer`}
          >
            <MessageSquare size={24} /> Comments
          </Link>
        </li>
      </ul>

      <div className="p-4 w-full flex items-center gap-3 text-white border-t border-gray-300">
        <div>
          <img
            src={user?.imageUrl}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
        <div>
          <p className="font-bold">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-sm text-gray-300">{user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
