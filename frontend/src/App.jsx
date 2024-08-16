import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Problemset from "./pages/problemset";
import Problem from "./pages/problem";
import Question from "./pages/Question";
import Submissions from "./pages/submissions";
import PageNotFound from "./pages/notfound";
function App() {
  return (
    <Routes>
      <Route path="/home/:codeforcesId" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/problemset" element={<Problemset />} />
      <Route path="/problem" element={<Problem />} />
      <Route path="/question/:contest_id/:index" element={<Problem />} />
      <Route path="/submissions/:handle" element={<Submissions />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
