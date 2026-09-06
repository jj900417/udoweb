type Props = {
  title: string;
  subtitle?: string;
  level?: 1 | 2;
  action?: React.ReactNode;
};

export default function SectionHeader({ title, subtitle, level = 2, action }: Props) {
  const Tag = level === 1 ? 'h1' : 'h2';
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <Tag
          className={
            level === 1
              ? 'text-3xl font-bold tracking-tight text-ink sm:text-4xl'
              : 'text-xl font-bold tracking-tight text-ink sm:text-2xl'
          }
        >
          {title}
        </Tag>
        {subtitle && <p className="mt-1.5 text-sm text-faint sm:text-base">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
