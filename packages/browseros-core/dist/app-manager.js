// 기본 창 위치 및 크기
const DEFAULT_POSITION = { x: 50, y: 50 };
const DEFAULT_SIZE = { width: 500, height: 400 };
// 앱 매니저 구현
export class BrowserOSAppManager {
    constructor() {
        this.apps = new Map();
        this.appStates = new Map();
        this.eventListeners = new Map();
    }
    // 앱 등록
    registerApp(app) {
        this.apps.set(app.id, app);
        // 앱 상태 초기화
        if (!this.appStates.has(app.id)) {
            this.appStates.set(app.id, {
                isOpen: false,
                isMinimized: false,
                isActive: false,
                position: { ...DEFAULT_POSITION },
                size: { ...DEFAULT_SIZE },
            });
        }
    }
    // 앱 등록 해제
    unregisterApp(appId) {
        this.apps.delete(appId);
        this.appStates.delete(appId);
        this.eventListeners.delete(appId);
    }
    // 앱 가져오기
    getApp(appId) {
        return this.apps.get(appId);
    }
    // 모든 앱 가져오기
    getAllApps() {
        return Array.from(this.apps.values());
    }
    // 앱 상태 가져오기
    getAppState(appId) {
        const state = this.appStates.get(appId);
        if (!state) {
            throw new Error(`App ${appId} not found`);
        }
        return state;
    }
    // 앱 상태 설정
    setAppState(appId, state) {
        const currentState = this.getAppState(appId);
        this.appStates.set(appId, { ...currentState, ...state });
        // 앱이 활성화되면 다른 앱은 비활성화
        if (state.isActive) {
            for (const [id, appState] of this.appStates.entries()) {
                if (id !== appId && appState.isActive) {
                    this.appStates.set(id, { ...appState, isActive: false });
                }
            }
        }
    }
    // 앱 실행
    launchApp(appId) {
        const app = this.getApp(appId);
        if (!app) {
            throw new Error(`App ${appId} not found`);
        }
        const state = this.getAppState(appId);
        // 이미 열려있는 경우 활성화만 수행
        if (state.isOpen) {
            this.setAppState(appId, { isActive: true, isMinimized: false });
            return;
        }
        // 새 위치 계산 (이미 열린 앱 수에 따라 오프셋 적용)
        const openAppsCount = Array.from(this.appStates.values()).filter((s) => s.isOpen).length;
        const position = {
            x: DEFAULT_POSITION.x + openAppsCount * 30,
            y: DEFAULT_POSITION.y + openAppsCount * 30,
        };
        this.setAppState(appId, {
            isOpen: true,
            isMinimized: false,
            isActive: true,
            position,
        });
    }
    // 앱 닫기
    closeApp(appId) {
        const state = this.getAppState(appId);
        // 앱이 활성화 상태였다면 다른 앱 활성화
        if (state.isActive) {
            const openApps = Array.from(this.appStates.entries()).filter(([id, s]) => id !== appId && s.isOpen && !s.isMinimized);
            if (openApps.length > 0) {
                this.setAppState(openApps[0][0], { isActive: true });
            }
        }
        this.setAppState(appId, {
            isOpen: false,
            isMinimized: false,
            isActive: false,
        });
    }
    // 앱 최소화
    minimizeApp(appId) {
        const state = this.getAppState(appId);
        // 앱이 활성화 상태였다면 다른 앱 활성화
        if (state.isActive) {
            const openApps = Array.from(this.appStates.entries()).filter(([id, s]) => id !== appId && s.isOpen && !s.isMinimized);
            if (openApps.length > 0) {
                this.setAppState(openApps[0][0], { isActive: true });
            }
        }
        this.setAppState(appId, {
            isMinimized: true,
            isActive: false,
        });
    }
    // 앱 이동
    moveApp(appId, position) {
        this.setAppState(appId, { position });
    }
    // 앱 크기 조정
    resizeApp(appId, size) {
        this.setAppState(appId, { size });
    }
    // 이벤트 리스너 등록
    addEventListener(appId, listener) {
        if (!this.eventListeners.has(appId)) {
            this.eventListeners.set(appId, new Set());
        }
        this.eventListeners.get(appId).add(listener);
        // 구독 취소 함수 반환
        return () => {
            const listeners = this.eventListeners.get(appId);
            if (listeners) {
                listeners.delete(listener);
            }
        };
    }
    // 메시지 전송
    sendMessage(from, to, type, payload) {
        const message = {
            type,
            payload,
            source: from,
            target: to,
        };
        // 특정 대상이 있는 경우
        if (to) {
            const listeners = this.eventListeners.get(to);
            if (listeners) {
                listeners.forEach((listener) => listener(message));
            }
        }
        // 브로드캐스트 메시지
        else {
            for (const [appId, listeners] of this.eventListeners.entries()) {
                if (appId !== from) {
                    listeners.forEach((listener) => listener(message));
                }
            }
        }
    }
}
