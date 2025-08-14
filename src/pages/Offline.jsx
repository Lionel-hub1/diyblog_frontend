import { Link } from "react-router-dom";

const Offline = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
            <div className="text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-[#FFA559]/10 rounded-full p-8">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-20 w-20 text-[#FFA559]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a3 3 0 010 4.243m-9.9-1.414A9 9 0 0113.07 3.757M14.121 6.364a3 3 0 00-4.243 0m2.121 2.121a1 1 0 11-1.414 1.414m7.072 7.072a1 1 0 11-1.414 1.414M3 13h2m11.28 5.544l-1.92-1.92m4.368-1.632l1.92 1.92m-14.4-1.92l1.92-1.92M7.2 6.888l1.92 1.92"
                            />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-[#454545] mb-4">You're offline</h1>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                    It looks like you're not connected to the internet. Some features may not be available.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-[#FFA559] text-white font-bold rounded-md hover:bg-[#ff9233] transition-all duration-300 w-full sm:w-auto"
                    >
                        Try again
                    </button>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                        <Link
                            to="/"
                            className="px-6 py-3 bg-gray-200 text-[#454545] font-bold rounded-md hover:bg-gray-300 transition-all duration-300"
                        >
                            Go to Home
                        </Link>
                    </div>
                </div>

                <div className="mt-12">
                    <p className="text-sm text-gray-500">
                        You can still access previously visited pages while offline.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Offline;
