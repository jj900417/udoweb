import { Component, type ErrorInfo, type ReactNode } from 'react';

/*
 * 화면이 통째로 백지가 되는 것을 막는 마지막 그물.
 *
 * React 는 렌더/이펙트에서 예외가 나면 트리 전체를 버린다 — 사용자에게는 빈 화면만
 * 남고 뒤로가기조차 듣지 않는다. 여기서 잡아 최소한 "무엇이 잘못됐고 어떻게 돌아가는지"를
 * 보여준다. 오류 내용은 콘솔에도 남긴다(개발 중 원인 추적용).
 */
type Props = { children: ReactNode };
type State = { error: Error | null };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[udoweb] 화면 오류:', error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="display text-2xl font-bold text-ink">화면을 그리지 못했습니다</h1>
        <p className="mt-3 text-ink-soft">
          잠시 문제가 생겼습니다. 새로고침하면 대부분 정상으로 돌아옵니다.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" onClick={() => window.location.reload()} className="btn-primary">
            새로고침
          </button>
          <a href="/" className="btn-ghost">
            홈으로
          </a>
        </div>
        <p className="caption mt-8 break-words">{error.message}</p>
      </div>
    );
  }
}
