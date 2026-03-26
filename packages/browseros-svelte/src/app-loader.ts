import type { Component } from 'svelte'

// 앱 컴포넌트 레지스트리
const appComponents: Map<string, Component<any>> = new Map()

// 컴포넌트 등록 함수
export function registerAppComponent(name: string, component: Component<any>) {
  appComponents.set(name, component)
}

// 컴포넌트 조회 함수
export function getAppComponent(name: string): Component<any> | undefined {
  return appComponents.get(name)
}
