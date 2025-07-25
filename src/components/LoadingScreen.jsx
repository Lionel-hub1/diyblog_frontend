import React from "react";

const LoadingScreen = () => (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#454545] bg-opacity-95 backdrop-blur transition-all duration-500">
        <div className="flex flex-row items-center mb-4 space-x-3">
            <span className="text-4xl font-black text-[#FFE6C7] tracking-wide animate-pulse">DIY</span>
            <span className="text-4xl font-semibold text-[#FFA559] animate-bounce">Blog</span>
        </div>
        <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#FFA559] animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFE6C7] animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFA559] animate-bounce"></div>
        </div>
        <div className="mt-6 text-[#FFE6C7] text-lg font-medium tracking-widest animate-pulse">
            Loading...
        </div>
    </div>
);

export default LoadingScreen;
