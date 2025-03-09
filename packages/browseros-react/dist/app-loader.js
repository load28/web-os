"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, Suspense } from "react";
import { appLoader } from "@browseros/core";
export function AppLoader({ app, fallback = _jsx("div", { children: "Loading..." }) }) {
    const [Component, setComponent] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        const loadComponent = async () => {
            try {
                const AppComponent = await appLoader.loadApp(app);
                setComponent(() => AppComponent);
            }
            catch (err) {
                console.error(`앱 ${app.id} 로드 중 오류 발생:`, err);
                setError(err instanceof Error ? err : new Error(String(err)));
            }
        };
        loadComponent();
    }, [app]);
    if (error) {
        return (_jsxs("div", { className: "p-4 text-red-500", children: [_jsx("h3", { className: "font-bold", children: "\uC571 \uB85C\uB4DC \uC624\uB958" }), _jsx("p", { children: error.message })] }));
    }
    if (!Component) {
        return _jsx(_Fragment, { children: fallback });
    }
    return (_jsx(Suspense, { fallback: fallback, children: _jsx(Component, {}) }));
}
