import React from "react";

export default function Bubble({ role = "assistant", children }) {
  const isUser = role === "user";
  const base = "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 shadow";
  const color = isUser
    ? "bg-blue-600 text-white"
    : role === "error"
    ? "bg-red-50 text-red-700 border border-red-200"
    : "bg-gray-100 text-gray-900";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`${base} ${color}`}>{children}</div>
    </div>
  );
}
