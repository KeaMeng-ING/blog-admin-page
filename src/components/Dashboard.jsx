import React, { useEffect, useRef, useState } from "react";
import NavBar from "./layouts/NavBar";
import { useAuthContext } from "../hook/useAuthContext";
import { PlusCircle, Users, FileText, BarChart3, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Overview from "./Overview";
import RecentUsers from "./RecentUser";
import BlogPostCard from "./BlogPostcard";
import axios from "axios";
import { NavLink } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuthContext();
  const [data, setData] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://blog-backend-a3p6.onrender.com/api/admin/dashboard"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchRecentPosts = async () => {
      try {
        const response = await axios.get(
          "https://blog-backend-a3p6.onrender.com/api/admin/recentPost"
        );
        console.log(response.data);
        setRecentPosts(response.data);
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      }
    };

    fetchData();
    fetchRecentPosts();
  }, []);

  return (
    <div className="flex w-full min-h-screen">
      <NavBar />

      <div className="ml-64 flex-1 bg-gray-100">
        <div className="bg-white w-full h-16 border-b-my-primary border-b-2 pr-5">
          {/* Dropdown of profile Image */}
          {user && (
            <div
              ref={dropdownRef}
              className="relative flex items-center justify-end h-full"
            >
              <div
                onClick={toggleDropdown}
                className="cursor-pointer flex items-center"
              >
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="w-8 rounded-full h-8 object-cover"
                />
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 top-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <NavLink
                    to={``}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Back to KMBlog
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

            <div className="flex items-center gap-4">
              {/* New Post Button */}
              <button
                className="flex items-center gap-2 bg-my-primary text-white px-4 py-3 rounded-lg font-medium hover:bg-my-primary-100 transition duration-300"
                onClick={() => {
                  window.open(
                    "https://blog-frontend-react-one.vercel.app//blog/create",
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              >
                <PlusCircle className="h-5 w-5" />
                New Post
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white text-gray-800 mt-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-800">
                  Total Posts
                </CardTitle>
                <FileText className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-800">
                  {data.postCount}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white text-gray-800 mt-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-800">
                  Total Views
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-800">
                  {data.viewCount}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white text-gray-800 mt-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-800">
                  Active Users
                </CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-800">
                  {data.userCount}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 bg-white text-gray-800 mt-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3 bg-white text-gray-800 mt-4">
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentUsers />
              </CardContent>
            </Card>
          </div>
          <h2 className="text-xl text-black mt-4 font-bold">Recent Posts</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <BlogPostCard
                key={post.id} // Ensure each post has a unique key
                title={post.title}
                description={post.subtitle}
                date={new Date(post.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                views={post.views}
                image={post.imageUrl || "/placeholder.svg?height=200&width=400"}
                author={{
                  name: post.author.firstName + " " + post.author.lastName,
                  avatar:
                    post.author.imageUrl ||
                    "/placeholder.svg?height=40&width=40",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
