import React from "react";

export const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#e5e5e5]">
            <h1 className="text-[180px] font-light text-[#d3d3d3] leading-none">404</h1>
            <div className="text-center -mt-10">
                <h2 className="text-5xl text-[#555555] font-normal mb-2">Page Not Found</h2>
                <p className="text-[#666666] mb-8 text-lg">The page you requested could not be found</p>
            </div>
        </div>
    )
}