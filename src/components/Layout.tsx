import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const { pathname } = useLocation();
  /*
   * 페이지 이동 시 스크롤을 위로 — SPA 기본 동작 보정.
   *
   * ⚠ 반드시 블록 본문으로 쓴다. `useEffect(() => window.scrollTo(0, 0), [...])` 처럼
   *   화살표 함수의 암묵적 반환을 쓰면 그 반환값이 React 에게 '정리 함수'로 넘어가고,
   *   다음 이동에서 언마운트할 때 `destroy is not a function` 으로 앱 전체가 죽는다
   *   (화면이 백지가 되고 뒤로가기도 안 먹어 새로고침해야 살아난다).
   */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
