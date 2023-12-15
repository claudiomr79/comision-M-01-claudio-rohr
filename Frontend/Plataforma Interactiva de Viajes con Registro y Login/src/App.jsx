import "./App.css";
import Post from "./components/Post";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Main from "./components/Main";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register } from "./components/Register";
import { StartSession } from "./components/StartSession";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Main />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post" element={<Post />} />
          <Route path="/login" element={<StartSession />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
