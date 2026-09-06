import { useContent } from '../i18n';

/*
 * 푸터는 한 줄로 끝낸다.
 * 데이터 출처·외부 링크 묶음은 화면을 길게만 만들어서 뺐다 —
 * 출처가 필요한 곳(운항 카드·아카이브 기록)에서는 그 자리에서 밝힌다.
 */
export default function Footer() {
  const { site, ui } = useContent();
  return (
    <footer className="mt-20 border-t border-line bg-surface-soft">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="font-semibold text-ink">
          {site.name} · {site.tagline}
        </p>
        <p className="mt-1 text-sm text-faint">{ui.footer.madeBy}</p>
        <p className="caption mt-8">© {site.operator.name}</p>
      </div>
    </footer>
  );
}
