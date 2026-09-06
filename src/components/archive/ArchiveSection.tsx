import type { ReactNode } from 'react';

/*
 * 아카이브 영역의 섹션 머리. 관광 페이지의 SectionHeader 와 분리한 이유는
 * 타이포(명조 표제 + 영문 부제)와 여백이 다르기 때문이다.
 * children 이 없으면 아무것도 그리지 않는다 — 빈 헤딩이 남지 않게.
 */
export default function ArchiveSection({
  title,
  sub,
  desc,
  action,
  children,
  level = 2,
}: {
  title: string;
  sub?: string;
  desc?: string;
  action?: ReactNode;
  children?: ReactNode;
  level?: 1 | 2;
}) {
  const Heading = level === 1 ? 'h1' : 'h2';
  return (
    <section className="mt-20 first:mt-0">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          {sub && <p className="credit mb-1">{sub}</p>}
          <Heading
            className={
              level === 1
                ? 'display t-display font-bold text-ink'
                : 'display t-section font-bold text-ink'
            }
          >
            {title}
          </Heading>
          {desc && <p className="mt-2 t-meta text-faint">{desc}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
