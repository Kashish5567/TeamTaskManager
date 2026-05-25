import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import Tasks from "../pages/Tasks";
import ProjectDetails from "../pages/ProjectDetails";
import Profile from "../pages/Profile";
import Members from "../pages/Members";
import Notifications from "../pages/Notifications";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Login />}          />
        <Route path="/register"    element={<Register />}       />
        <Route path="/dashboard"   element={<Dashboard />}      />
        <Route path="/projects"    element={<Projects />}       />
        <Route path="/tasks"       element={<Tasks />}          />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/members"     element={<Members />}        />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </BrowserRouter>
  );
}