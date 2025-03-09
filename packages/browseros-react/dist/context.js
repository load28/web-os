"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { appManager } from "@browseros/core";
// 컨텍스트 생성
const BrowserOSContext = createContext(undefined);
// 프로바이더 컴포넌트
export function BrowserOSProvider({ children }) {
    const [apps, setApps] = useState([]);
    const [appStates, setAppStates] = useState({});
    // 앱 목록 및 상태 업데이트
    const updateAppsAndStates = () => {
        const allApps = appManager.getAllApps();
        setApps(allApps);
        const states = {};
        for (const app of allApps) {
            states[app.id] = appManager.getAppState(app.id);
        }
        setAppStates(states);
    };
    // 앱 실행
    const launchApp = (appId) => {
        appManager.launchApp(appId);
        updateAppsAndStates();
    };
    // 앱 닫기
    const closeApp = (appId) => {
        appManager.closeApp(appId);
        updateAppsAndStates();
    };
    // 앱 최소화
    const minimizeApp = (appId) => {
        appManager.minimizeApp(appId);
        updateAppsAndStates();
    };
    // 앱 이동
    const moveApp = (appId, x, y) => {
        appManager.moveApp(appId, { x, y });
        updateAppsAndStates();
    };
    // 앱 크기 조정
    const resizeApp = (appId, width, height) => {
        appManager.resizeApp(appId, { width, height });
        updateAppsAndStates();
    };
    // 메시지 전송
    const sendMessage = (from, to, type, payload) => {
        appManager.sendMessage(from, to, type, payload);
    };
    // 이벤트 리스너 등록
    const registerEventListener = (appId, listener) => {
        return appManager.addEventListener(appId, listener);
    };
    // 초기화
    useEffect(() => {
        updateAppsAndStates();
        // 앱 상태 변경 감지를 위한 인터벌 설정
        const interval = setInterval(updateAppsAndStates, 100);
        return () => clearInterval(interval);
    }, []);
    return (_jsx(BrowserOSContext.Provider, { value: {
            apps,
            appStates,
            launchApp,
            closeApp,
            minimizeApp,
            moveApp,
            resizeApp,
            sendMessage,
            registerEventListener,
        }, children: children }));
}
// 훅 생성
export function useBrowserOS() {
    const context = useContext(BrowserOSContext);
    if (context === undefined) {
        throw new Error("useBrowserOS must be used within a BrowserOSProvider");
    }
    return context;
}
