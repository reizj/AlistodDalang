import React from "react";

export default function Footer() {
  return (
    <footer className=" text-gray-300 py-6 mt-10">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm tracking-wide">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-white">AlistodDalang</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
