import "./App.css";
import { Routes, Route } from "react-router-dom";
import RootLayout from "./components/layouts/root-layout";
import LandingPage from "./components/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import PostPage from "./components/PostPage";
import UsersPage from "./components/UsersPage";
import CommentsPage from "./components/CommentsPage";
import EditPost from "./components/EditPost";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />}></Route>
      <Route path="/admin" element={<RootLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="posts" element={<PostPage />} />
          <Route path="posts/edit/:id" element={<EditPost />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="comments" element={<CommentsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
