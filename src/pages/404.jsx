import { Link } from "react-router-dom";

const NoPage = () => {
  return (
    <div className="min-h-[80vh] bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="text-[#FF6000] text-9xl font-black opacity-20">404</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg className="w-32 h-32 text-[#FF6000]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-[#454545] mb-4">Oops! Page not found</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          We can't seem to find the page you're looking for. It might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/" className="px-6 py-3 bg-[#FFA559] text-white font-bold rounded-md hover:bg-[#ff9233] transition-all duration-300 transform hover:-translate-y-1">
            Back to Home
          </Link>
          <Link to="/blogs" className="px-6 py-3 bg-[#454545] text-white font-bold rounded-md hover:bg-[#353535] transition-all duration-300 transform hover:-translate-y-1">
            Browse Articles
          </Link>
        </div>

        <div className="mt-12 flex flex-col items-center space-y-4">
          <p className="font-medium text-gray-700">Looking for something specific?</p>
          <Link to="/contact" className="text-[#FF6000] hover:text-[#ff7a2b] font-medium underline">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NoPage;
