import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/axios";

import {
  FaTasks,
  FaCheckCircle,
  FaUsers,
  FaChartBar,
  FaEnvelope,
  FaLock,
  FaSignInAlt,
} from "react-icons/fa";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post("/auth/login", formData);

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful");

      navigate("/dashboard");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );

    }

  };

  return (

    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">

      <div className="w-full h-[95vh] max-w-7xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col md:flex-row">

        {/* LEFT PANEL */}

        <div className="md:w-[45%] bg-[#0f1623] p-12 flex flex-col justify-between relative overflow-hidden">

          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-blue-900 opacity-40"></div>

          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-green-900 opacity-40"></div>

          <div className="relative z-10">

            <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">

              <FaTasks className="text-white text-2xl" />

            </div>

            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              Team Task
              <br />
              Manager
            </h1>

            <p className="text-slate-400 text-base leading-7 max-w-md">
              Manage projects, collaborate with teams, assign tasks,
              and track progress — all in one powerful workspace.
            </p>

            {/* AVATARS */}

            <div className="flex items-center mt-10">

              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold border-2 border-[#0f1623]">
                AK
              </div>

              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold border-2 border-[#0f1623] -ml-2">
                SR
              </div>

              <div className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold border-2 border-[#0f1623] -ml-2">
                PJ
              </div>

              <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs font-bold border-2 border-[#0f1623] -ml-2">
                ML
              </div>

              <span className="ml-4 text-sm text-slate-400">
                <span className="text-slate-200 font-semibold">
                  2,400+
                </span>{" "}
                teams onboard
              </span>

            </div>

          </div>

          {/* FEATURES */}

          <div className="relative z-10 space-y-6 mt-10">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">

                <FaCheckCircle className="text-blue-400 text-lg" />

              </div>

              <p className="text-slate-300 text-sm">
                Assign & track tasks in real time
              </p>

            </div>

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">

                <FaUsers className="text-green-400 text-lg" />

              </div>

              <p className="text-slate-300 text-sm">
                Collaborate seamlessly across teams
              </p>

            </div>

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">

                <FaChartBar className="text-yellow-400 text-lg" />

              </div>

              <p className="text-slate-300 text-sm">
                Visual dashboards & progress reports
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="flex-1 p-12 flex flex-col justify-center">

          <div className="max-w-lg w-full mx-auto">

            <h2 className="text-4xl font-bold text-slate-900 mb-3">
              Welcome back
            </h2>

            <p className="text-slate-500 text-base mb-10">
              Sign in to your workspace
            </p>

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}

              <div className="mb-6">

                <label className="block text-xs uppercase tracking-wide text-slate-500 mb-2 font-semibold">
                  Email
                </label>

                <div className="relative">

                  <FaEnvelope className="absolute left-4 top-4 text-slate-400" />

                  <input
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="mb-8">

                <label className="block text-xs uppercase tracking-wide text-slate-500 mb-2 font-semibold">
                  Password
                </label>

                <div className="relative">

                  <FaLock className="absolute left-4 top-4 text-slate-400" />

                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                  />

                </div>

              </div>

              {/* BUTTON */}

              <button
                type="submit"
                className="w-full h-14 bg-blue-500 hover:bg-blue-600 transition-all duration-300 rounded-2xl text-white font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-200"
              >
                <FaSignInAlt />
                Login to Dashboard
              </button>

            </form>

            {/* LINK */}

            <p className="text-center text-sm text-slate-500 mt-8">

              Don’t have an account?

              <Link
                to="/register"
                className="text-blue-500 font-semibold ml-1 hover:underline"
              >
                Create one free
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;
