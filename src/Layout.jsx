import { Outlet, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import FooterLion from "./components/FooterLion";

const Layout = () => {
  const location = useLocation();

  const paths = [
    { path: "/", name: "Home" },
    { path: "/blogs", name: "Blogs" },
    { path: "/services", name: "Services" },
    { path: "/contact", name: "Contact" },
  ];

  const activeness = "border-b-2 border-[#FFA559]";

  return (
    <>
      <header className="text-gray-600 body-font bg-[#454545] sticky top-0 z-10">
        <div className="container mx-auto flex flex-wrap py-5 px-4 md:px-14 flex-col md:flex-row items-center">
          <Link
            to="/"
            className="flex title-font font-medium items-center mb-4 md:mb-0"
          >
            <span className="text-3xl font-black text-[#FFE6C7]">DIY</span>{" "}
            <span className="text-3xl font-semibold text-[#FFA559]">Blog</span>
          </Link>
          <nav className="md:ml-auto flex flex-wrap font-semibold items-center text-[#FFE6C7] justify-center space-x-10">
            {paths.map((path, index) => {
              return (
                <Link
                  key={index}
                  to={path.path}
                  className={`${location.pathname === path.path ? activeness : ""
                    } hover:text-[#FFA559] transition duration-300 ease-in-out`}
                >
                  {path.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <Outlet />
      <FooterLion />
    </>
  );
};

export default Layout;
