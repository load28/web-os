"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { BrowserOSProvider } from "./context";
import { Desktop } from "./desktop";
import { Taskbar } from "./taskbar";
import { AppWindow } from "./app-window";
import { AppLoader } from "./app-loader";
import { useBrowserOS } from "./context";
import { appManager } from "@browseros/core";
export function BrowserOS({ apps, className = "" }) {
    // 앱 등록
    useEffect(() => {
        apps.forEach((app) => {
            appManager.registerApp(app);
        });
        // 컴포넌트 언마운트 시 앱 등록 해제
        return () => {
            apps.forEach((app) => {
                appManager.unregisterApp(app.id);
            });
        };
    }, [apps]);
    return (_jsx(BrowserOSProvider, { children: _jsxs("div", { className: `flex flex-col h-screen bg-blue-50 overflow-hidden ${className}`, children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Desktop, {}), _jsx(WindowManager, {})] }), _jsx(Taskbar, {})] }) }));
}
// 창 관리자 컴포넌트
function WindowManager() {
    const { apps, appStates } = useBrowserOS();
    return (_jsx(_Fragment, { children: apps.map((app) => {
            const state = appStates[app.id];
            if (!state || !state.isOpen)
                return null;
            return (_jsx(AppWindow, { appId: app.id, children: _jsx(AppLoader, { app: app }) }, app.id));
        }) }));
}
