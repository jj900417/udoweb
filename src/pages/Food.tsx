import { useContent } from '../i18n';
import SectionHeader from '../components/SectionHeader';
import ShopList from '../components/ShopList';

export default function Food() {
  const { food, ui } = useContent();

  return (
    <>
      <SectionHeader title={food.title} level={1} />

      {/*
        * 설명 없이 이름만 — 무엇이 있는지만 알려주고, 자세한 것은 아래 가게 목록이 말한다.
        * (문안은 src/data/food.ts 에 남아 있어 언제든 되살릴 수 있다.)
        */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {food.items.map((item) => (
          <article key={item.title} className="card flex flex-col items-center gap-1 py-4 text-center">
            <span className="text-2xl" aria-hidden>
              {item.icon}
            </span>
            <h3 className="t-meta font-bold text-ink">{item.title}</h3>
          </article>
        ))}
      </div>

      <div className="mt-14">
        <SectionHeader title={ui.shops.title} />
        <ShopList />
      </div>
    </>
  );
}
