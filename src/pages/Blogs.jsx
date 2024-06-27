import { Link } from "react-router-dom";

const Blogs = () => {
  return (
    <div className="h-[100vh] bg-gray-100 text-center flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">
        Oops! This page is still under construction.
      </h1>
      <p className="text-lg mb-8 text-gray-600">
        It looks like Lionel hasn&apos;t finished designing this page yet.
      </p>
      <Link to="/contact" className="bg-[#FFA559] font-black text-white px-4 py-2 rounded-md">
        Contact Lionel
      </Link>
    </div>
  );
};

export default Blogs;
