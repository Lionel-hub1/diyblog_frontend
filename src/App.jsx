import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import NoPage from "./pages/404";
import Services from "./pages/Services";
import Article from "./pages/Article";
import Authenticate from "./auth/Authenticate";
import { LoadingProvider, useLoading } from "./context/LoadingContext";
import LoadingScreen from "./components/LoadingScreen";

// Helper to show loading overlay at root
function AppWithLoading() {
  const { isLoading } = useLoading();
  return (
    <>
      {isLoading && <LoadingScreen />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
            <Route path="blogs/:id" element={<Article />} />
            <Route path="*" element={<NoPage />} />
          </Route>
          <Route path="auth" element={<Authenticate />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

function App() {
  return (
    <LoadingProvider>
      <AppWithLoading />
    </LoadingProvider>
  );
}

export default App;
