"use client";
import { useEffect } from "react";
// 메시지 버스 클래스
class MessageBus {
    constructor() {
        this.listeners = new Map();
    }
    // 메시지 리스너 등록
    subscribe(appId, callback) {
        if (!this.listeners.has(appId)) {
            this.listeners.set(appId, []);
        }
        this.listeners.get(appId).push(callback);
        // 구독 취소 함수 반환
        return () => {
            const appListeners = this.listeners.get(appId);
            if (appListeners) {
                const index = appListeners.indexOf(callback);
                if (index !== -1) {
                    appListeners.splice(index, 1);
                }
            }
        };
    }
    // 메시지 발행
    publish(message) {
        // 메시지 객체를 깊은 복사하여 전달 (객체 참조 문제 방지)
        const safeMessage = this.safeClone(message);
        // 특정 대상이 있는 경우
        if (safeMessage.target) {
            const targetListeners = this.listeners.get(safeMessage.target);
            if (targetListeners) {
                targetListeners.forEach((listener) => listener(safeMessage));
            }
        }
        // 브로드캐스트 메시지
        else {
            this.listeners.forEach((listeners, appId) => {
                if (appId !== safeMessage.source) {
                    // 자기 자신에게는 보내지 않음
                    listeners.forEach((listener) => listener(safeMessage));
                }
            });
        }
    }
    // 객체를 안전하게 복제 (깊은 복사)
    safeClone(obj) {
        // 기본 타입이거나 null/undefined인 경우 그대로 반환
        if (obj === null || obj === undefined || typeof obj !== 'object') {
            return obj;
        }
        try {
            // JSON을 통한 깊은 복사 시도
            return JSON.parse(JSON.stringify(obj));
        }
        catch (e) {
            // 순환 참조 등의 문제가 있는 경우 원본 반환
            console.warn('객체 복제 실패:', e);
            return obj;
        }
    }
}
// 싱글톤 인스턴스 생성
export const messageBus = new MessageBus();
// React 훅으로 메시지 버스 사용
export function useMessageBus(appId, onMessage) {
    useEffect(() => {
        if (!onMessage)
            return;
        // 메시지 구독
        const unsubscribe = messageBus.subscribe(appId, onMessage);
        // 컴포넌트 언마운트 시 구독 취소
        return unsubscribe;
    }, [appId, onMessage]);
    // 메시지 발행 함수 반환
    return {
        sendMessage: (target, type, payload) => {
            // payload가 null이나 undefined인 경우 빈 객체 사용
            const safePayload = payload ?? {};
            messageBus.publish({
                source: appId,
                target,
                type,
                payload: safePayload,
            });
        },
    };
}
