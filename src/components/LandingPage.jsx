import React, { useState } from "react";
import { useAuthContext } from "../hook/useAuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LandingPage = () => {
  const [error, setError] = useState("");
  const { loading, setLoading, setUser } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        { email, password }
      );

      console.log(response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.data.id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          imageUrl: response.data.imageUrl,
          userName: response.data.username,
          email: response.data.email,
          bioProfile: response.data.bioProfile,
        })
      );

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      setUser({
        id: response.data.id,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        imageUrl: response.data.imageUrl,
        userName: response.data.username,
        email: response.data.email,
        bioProfile: response.data.bioProfile,
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("An error occurred during login. Please try again.");
        console.error("Login error:", error);
      }
    } finally {
      setLoading(false);
      navigate("/admin");
    }
  };

  return (
    <>
      <div className="flex w-full h-screen">
        <div className="bg-my-primary h-full w-[70%] flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center translate-x-7">
            <div className="bg-white inline-block p-2 rounded-full">
              <img src="/KM.svg" alt="" className="w-40" />
            </div>
            <h1 className="text-white text-4xl mt-8 font-bold">
              Kea Meng Blog Admin Dashboard
            </h1>
            <p className="text-white text-xl mt-3">
              Manage posts easily and maintain a healthy community.
            </p>
          </div>

          {/* Dog element moved here */}
          <div className="main mt-6 relative z-10">
            <div className="dog">
              <div className="dog__paws">
                <div className="dog__bl-leg leg">
                  <div className="dog__bl-paw paw"></div>
                  <div className="dog__bl-top top"></div>
                </div>
                <div className="dog__fl-leg leg">
                  <div className="dog__fl-paw paw"></div>
                  <div className="dog__fl-top top"></div>
                </div>
                <div className="dog__fr-leg leg">
                  <div className="dog__fr-paw paw"></div>
                  <div className="dog__fr-top top"></div>
                </div>
              </div>

              <div className="dog__body">
                <div className="dog__tail"></div>
              </div>

              <div className="dog__head">
                <div className="dog__snout">
                  <div className="dog__nose"></div>
                  <div className="dog__eyes">
                    <div className="dog__eye-l"></div>
                    <div className="dog__eye-r"></div>
                  </div>
                </div>
              </div>

              <div className="dog__head-c">
                <div className="dog__ear-l"></div>
                <div className="dog__ear-r"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="absolute bottom-6 left-0 right-0 text-center w-[70%]">
          <p class="text-white text-md">© 2025 Kea Meng Blog Admin Dashboard</p>
        </div>

        <div className="bg-white poppins-regular flex justify-center items-center w-[30%] h-full">
          <form
            className="w-3/4 h-auto bg-white  rounded-lg p-8 "
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col justify-center items-center mb-6">
              <h2 className="text-3xl font-bold text-my-primary mb-3 text-center">
                Log In
              </h2>
              <p>Please Sign in to your account</p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-3"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-my-primary focus:border-my-primary transition"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-3"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-my-primary focus:border-my-primary transition"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-my-primary text-white py-3 rounded-lg font-semibold hover:bg-my-primary-100 transition duration-300"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
