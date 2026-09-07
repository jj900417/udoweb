import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { LocaleProvider } from './i18n';
import { splitLocale } from './i18n/route';
import { ThemeProvider } from './theme';
import './styles/global.css';

/*
 * 주소가 언어를 정했으면 그걸 따르고, 아니면 예전처럼 기기 설정을 따라요.
 *
 * `basename` 을 넘기면 화면 안의 `<Link to="/about">` 이 전부 알아서
 * `/ja/about` 이 돼요 — 링크 35곳을 고치지 않아도 되는 이유예요.
 */
const route = splitLocale(window.location.pathname);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <LocaleProvider forced={route.locale ?? undefined}>
          <BrowserRouter basename={route.basename || undefined}>
            <App />
          </BrowserRouter>
        </LocaleProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
