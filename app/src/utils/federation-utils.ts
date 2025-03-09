/**
 * Module Federation과 관련된 유틸리티 함수들
 */

// 동적으로 원격 스크립트 로드
export const loadRemoteScript = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 로드된 스크립트인지 확인
    if (document.querySelector(`script[src="${url}"]`)) {
      resolve()
      return
    }

    const script = document.createElement("script")
    script.src = url
    script.type = "text/javascript"
    script.async = true

    script.onload = () => {
      console.log(`원격 스크립트 로드 완료: ${url}`)
      resolve()
    }

    script.onerror = (error) => {
      console.error(`원격 스크립트 로드 실패: ${url}`, error)
      reject(new Error(`원격 스크립트 로드 실패: ${url}`))
    }

    document.head.appendChild(script)
  })
}

// 원격 컴포넌트 로딩
export const loadRemoteComponent = async (url: string, scope: string, module: string) => {
  try {
    // 스크립트 로드
    await loadRemoteScript(url)

    // @ts-ignore
    const container = window[scope]
    if (!container) {
      throw new Error(`원격 컨테이너 ${scope}를 찾을 수 없습니다`)
    }

    // 컨테이너 초기화
    // @ts-ignore
    if (!container.__initialized && window.__webpack_share_scopes__) {
      // @ts-ignore
      await container.init(window.__webpack_share_scopes__.default)
      // @ts-ignore
      container.__initialized = true
    }

    // 모듈 로드
    // @ts-ignore
    const factory = await container.get(module)
    return factory()
  } catch (err) {
    console.error(`원격 컴포넌트 로드 중 오류 발생:`, err)
    throw err
  }
}

// 웹팩 공유 스코프 초기화
export const initSharedScope = () => {
  // @ts-ignore
  window.__webpack_share_scopes__ = { default: {} }
}
