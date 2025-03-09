"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useBrowserOS } from "./context";
import { DesktopIcon } from "./desktop-icon";
export function Desktop({ className = "" }) {
    const { apps, launchApp } = useBrowserOS();
    return (_jsx("div", { className: `absolute inset-0 p-4 grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] auto-rows-[80px] gap-4 ${className}`, children: apps.map((app) => (_jsx(DesktopIcon, { appId: app.id, name: app.name, icon: app.icon, onClick: () => launchApp(app.id) }, app.id))) }));
}
