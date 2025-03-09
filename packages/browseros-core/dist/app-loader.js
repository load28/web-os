export class BrowserOSAppLoader {
    // 이제 모듈 페더레이션을 사용하여 로딩하므로 스텀 구현
    async loadApp(app) {
        console.warn('모듈 페더레이션을 사용하도록 변경되었습니다. 개별 컴포넌트를 직접 로드해주세요.');
        return null;
    }
}
