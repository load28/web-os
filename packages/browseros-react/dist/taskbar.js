"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBrowserOS } from "./context";
export function Taskbar({ className = "" }) {
    const { apps, appStates, launchApp } = useBrowserOS();
    return (_jsxs("div", { className: `flex items-center h-12 px-2 bg-gray-800 border-t border-gray-700 ${className}`, children: [_jsx("div", { className: "flex items-center gap-1", children: apps.map((app) => {
                    const state = appStates[app.id];
                    const isOpen = state?.isOpen || false;
                    const isActive = state?.isActive || false;
                    return (_jsx("button", { className: `flex items-center justify-center w-10 h-10 rounded-md transition-colors ${isActive
                            ? "bg-blue-600 text-white"
                            : isOpen
                                ? "bg-gray-700 text-white"
                                : "bg-transparent text-gray-300 hover:bg-gray-700"}`, onClick: () => launchApp(app.id), children: _jsx("span", { className: "w-5 h-5", children: app.icon }) }, app.id));
                }) }), _jsx("div", { className: "ml-auto text-xs text-gray-400 px-2", children: "BrowserOS" })] }));
}
