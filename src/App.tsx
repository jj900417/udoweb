import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Spots from './pages/Spots';
import Access from './pages/Access';
import Experience from './pages/Experience';
import Food from './pages/Food';
import Gallery from './pages/Gallery';
import Tips from './pages/Tips';
import AppPage from './pages/AppPage';
import NotFound from './pages/NotFound';

/*
 * 라우트 맵 — src/data/nav.ts 의 path 와 1:1 이어야 한다.
 * 새 페이지를 추가할 때: pages/ 에 컴포넌트 → 여기 Route → nav.ts 에 항목.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="spots" element={<Spots />} />
        <Route path="access" element={<Access />} />
        <Route path="experience" element={<Experience />} />
        <Route path="food" element={<Food />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="tips" element={<Tips />} />
        <Route path="app" element={<AppPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
