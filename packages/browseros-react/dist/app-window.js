"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback } from "react";
import { useBrowserOS } from "./context";
export function AppWindow({ appId, children }) {
    const { apps, appStates, closeApp, minimizeApp, moveApp, resizeApp } = useBrowserOS();
    const appState = appStates[appId];
    const app = apps.find((a) => a.id === appId);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const windowRef = useRef(null);
    const [isMovingOrResizing, setIsMovingOrResizing] = useState(false);
    // 앱이 열려있지 않거나 최소화되어 있으면 렌더링하지 않음
    if (!appState || !appState.isOpen || appState.isMinimized || !app) {
        return null;
    }
    const handleMouseDown = (e) => {
        if (e.target === e.currentTarget || e.target.classList.contains("window-titlebar")) {
            setIsDragging(true);
            setIsMovingOrResizing(true);
            setDragStart({
                x: e.clientX - appState.position.x,
                y: e.clientY - appState.position.y,
            });
        }
    };
    const handleResizeMouseDown = (e) => {
        e.stopPropagation();
        setIsResizing(true);
        setIsMovingOrResizing(true);
        setResizeStart({
            x: e.clientX,
            y: e.clientY,
            width: appState.size.width,
            height: appState.size.height,
        });
    };
    const handleMouseMove = useCallback((e) => {
        if (isDragging) {
            const newX = Math.max(0, e.clientX - dragStart.x);
            const newY = Math.max(0, e.clientY - dragStart.y);
            moveApp(appId, newX, newY);
        }
        else if (isResizing) {
            const newWidth = Math.max(300, resizeStart.width + (e.clientX - resizeStart.x));
            const newHeight = Math.max(200, resizeStart.height + (e.clientY - resizeStart.y));
            resizeApp(appId, newWidth, newHeight);
        }
    }, [isDragging, isResizing, dragStart, resizeStart, appId, moveApp, resizeApp]);
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
        setIsMovingOrResizing(false);
    }, []);
    // 이벤트 리스너 등록 및 해제
    useEffect(() => {
        if (isMovingOrResizing) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isMovingOrResizing, handleMouseMove, handleMouseUp]);
    return (_jsxs("div", { ref: windowRef, className: `absolute rounded-lg shadow-lg overflow-hidden flex flex-col ${appState.isActive ? "z-10 ring-2 ring-blue-500" : "z-0"}`, style: {
            left: `${appState.position.x}px`,
            top: `${appState.position.y}px`,
            width: `${appState.size.width}px`,
            height: `${appState.size.height}px`,
        }, children: [_jsxs("div", { className: "window-titlebar flex items-center justify-between px-3 py-2 bg-white border-b cursor-move", onMouseDown: handleMouseDown, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-4 h-4 text-blue-600", children: app.icon }), _jsx("span", { className: "text-sm font-medium", children: app.name })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { className: "p-1 rounded-full hover:bg-gray-100", onClick: () => minimizeApp(appId), children: _jsx("span", { className: "block w-3 h-3 text-gray-600", children: "-" }) }), _jsx("button", { className: "p-1 rounded-full hover:bg-gray-100", onClick: () => closeApp(appId), children: _jsx("span", { className: "block w-3 h-3 text-gray-600", children: "\u00D7" }) })] })] }), _jsx("div", { className: "flex-1 bg-white overflow-auto text-gray-800 app-window-content", children: children }), _jsx("div", { className: "absolute bottom-0 right-0 w-4 h-4 cursor-se-resize", onMouseDown: handleResizeMouseDown, children: _jsx("div", { className: "w-0 h-0 border-t-8 border-l-8 border-transparent border-t-gray-300 transform rotate-45 translate-x-1 translate-y-1" }) })] }));
}
