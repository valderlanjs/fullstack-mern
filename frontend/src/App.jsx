import { Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";

import Home from "./pages/Home";
import About from "./pages/About";
import Collection from "./pages/Collection";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Product from "./pages/Product";
import FaqPage from "./components/FaqPage"
import TermsOfUsePage from "./components/TermsOfUsePage"
import PrivacyPolicyPage from "./components/PrivacyPolicyPage"



export default function App() {
  return (
    <main className="overflow-hidden text-[#404040] bg-tertiary/5">
      <ToastContainer />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/faqs" element={<FaqPage />} />
        <Route path="/termos-uso" element={<TermsOfUsePage />} />
        <Route path="/politica-privacidade" element={<PrivacyPolicyPage />} />
      </Routes>
    </main>
  )
}
