import type { Rights } from '../../archive';

/* credit 은 작품 화면에서 빠지면 안 된다(docs/archive-rights.md). */
export default function ArchiveCredit({ rights }: { rights: Rights }) {
  if (!rights.creditLine && !rights.copyrightHolder) return null;
  return (
    <p className="credit mt-2">
      {rights.creditLine || `ⓒ ${rights.copyrightHolder}`}
    </p>
  );
}
