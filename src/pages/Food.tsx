import { useContent } from '../i18n';
import SectionHeader from '../components/SectionHeader';
import ShopList from '../components/ShopList';

export default function Food() {
  const { food, ui } = useContent();

  return (
    <>
      <SectionHeader title={food.title} subtitle={food.subtitle} level={1} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {food.items.map((item) => (
          <article key={item.title} className="card">
            <div className="text-2xl" aria-hidden>
              {item.icon}
            </div>
            <h3 className="mt-2 font-bold text-ink">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{item.desc}</p>
          </article>
        ))}
      </div>

      <div className="mt-14">
        <SectionHeader title={ui.shops.title} subtitle={food.note} />
        <ShopList />
      </div>
    </>
  );
}
