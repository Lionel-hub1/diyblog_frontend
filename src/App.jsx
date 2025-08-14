import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./Layout";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import NoPage from "./pages/404";
import Services from "./pages/Services";
import Article from "./pages/Article";
import Authenticate from "./auth/Authenticate";
import Offline from "./pages/Offline";
import { LoadingProvider, useLoading } from "./context/LoadingContext";
import LoadingScreen from "./components/LoadingScreen";

// Helper to show loading overlay at root
function AppWithLoading() {
  const { isLoading } = useLoading();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Update network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Show offline component when the user is offline
  if (!isOnline) {
    return <Offline />;
  }

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
          <Route path="offline" element={<Offline />} />
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
