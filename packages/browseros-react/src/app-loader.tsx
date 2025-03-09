"use client"

import type React from "react"
import { useMemo, Suspense } from "react"
import { type AppManifest } from "@browseros/core"

// 앱 컴포넌트 매핑
type AppComponentsMap = {
  [key: string]: React.ComponentType<any>;
};

// 컴포넌트 레지스트리
const appComponents: AppComponentsMap = {};

// 컴포넌트 등록 함수
export function registerAppComponent(name: string, component: React.ComponentType<any>) {
  appComponents[name] = component;
}

interface AppLoaderProps {
  app: AppManifest
  fallback?: React.ReactNode
}

export function AppLoader({ app, fallback = <div>Loading...</div> }: AppLoaderProps) {
  const Component = useMemo(() => {
    const { componentName } = app;
    if (!componentName) {
      console.error(`앱 ${app.id}에 componentName이 없습니다.`);
      return null;
    }

    const AppComponent = appComponents[componentName];
    if (!AppComponent) {
      console.error(`컴포넌트 "${componentName}"가 등록되지 않았습니다.`);
      return null;
    }

    return AppComponent;
  }, [app]);

  if (!Component) {
    return (
      <div className="p-4 text-red-500">
        <h3 className="font-bold">앱 로드 오류</h3>
        <p>컴포넌트를 찾을 수 없습니다: {app.componentName}</p>
      </div>
    );
  }

  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
}
