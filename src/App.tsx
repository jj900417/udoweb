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
import TravelHub from './pages/TravelHub';
import NowHub from './pages/NowHub';
import History from './pages/History';
import HistoryDetail from './pages/HistoryDetail';
import Voices from './pages/Voices';
import VoicePersonDetail from './pages/VoicePersonDetail';
import ArchiveHome from './pages/archive/ArchiveHome';
import ArtistIndex from './pages/archive/ArtistIndex';
import ArtistDetail from './pages/archive/ArtistDetail';
import WorkDetail from './pages/archive/WorkDetail';
import CollectionDetail from './pages/archive/CollectionDetail';
import ExhibitionDetail from './pages/archive/ExhibitionDetail';
import LibraryIndex from './pages/archive/LibraryIndex';
import ArchiveNotFound from './pages/archive/ArchiveNotFound';
import NotFound from './pages/NotFound';

/*
 * 라우트 맵. 1차 메뉴(src/data/nav.ts)는 허브 6개를 가리키지만,
 * **기존 URL 은 하나도 바뀌지 않았다** — 공유된 링크가 계속 살아 있어야 한다.
 *
 * 새 페이지를 추가할 때: pages/ 에 컴포넌트 → 여기 Route → (1차 메뉴면) nav.ts.
 * 아카이브 상세 경로는 src/archive/ids.ts 의 entityPath() 가 만든다 — 문자열을
 * 화면마다 짓지 말고 그 함수를 쓴다.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />

        {/* 섬 소개 */}
        <Route path="about" element={<About />} />

        {/* 기록 — 아카이브 */}
        <Route path="archive" element={<ArchiveHome />} />
        <Route path="archive/artists" element={<ArtistIndex />} />
        <Route path="archive/artists/:slug" element={<ArtistDetail />} />
        <Route path="archive/works/:slug" element={<WorkDetail />} />
        <Route path="archive/collections/:slug" element={<CollectionDetail />} />
        <Route path="archive/exhibitions/:slug" element={<ExhibitionDetail />} />
        <Route path="archive/library" element={<LibraryIndex />} />
        <Route path="archive/*" element={<ArchiveNotFound />} />

        {/* 역사 */}
        <Route path="history" element={<History />} />
        <Route path="history/:slug" element={<HistoryDetail />} />

        {/* 목소리 */}
        <Route path="voices" element={<Voices />} />
        <Route path="voices/:slug" element={<VoicePersonDetail />} />

        {/* 여행 (허브 + 기존 페이지 — URL 유지) */}
        <Route path="travel" element={<TravelHub />} />
        <Route path="spots" element={<Spots />} />
        <Route path="access" element={<Access />} />
        <Route path="experience" element={<Experience />} />
        <Route path="food" element={<Food />} />
        <Route path="tips" element={<Tips />} />

        {/* 지금 우도 (허브 + 기존 페이지 — URL 유지) */}
        <Route path="now" element={<NowHub />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="app" element={<AppPage />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
