import React from "react";

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 mt-14">
      <main className="flex justify-center items-center p-8">
        <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
          {children}
        </div>
      </main>
    </div>
  );
}
