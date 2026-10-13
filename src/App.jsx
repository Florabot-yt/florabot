import { Routes, Route } from "react-router-dom";
import { ModeProvider } from "./contexts/ModeContext";
import { LangProvider } from "./contexts/LangContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Detect from "./pages/Detect";
import Environment from "./pages/Environment";
import Learn from "./pages/Learn";
import About from "./pages/About";

export default function App() {
  return (
    <LangProvider>
      <ModeProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detect" element={<Detect />} />
              <Route path="/environment" element={<Environment />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ModeProvider>
    </LangProvider>
  );
}
