"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function DesktopIcon({ appId, name, icon, onClick }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center gap-1 p-2 rounded cursor-pointer hover:bg-blue-100/50", onClick: onClick, children: [_jsx("div", { className: "flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm", children: _jsx("span", { className: "text-blue-600", children: icon }) }), _jsx("span", { className: "text-xs font-medium text-center text-gray-800", children: name })] }));
}
