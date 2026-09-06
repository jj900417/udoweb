import type { Overlay } from '..';

/* 日本語オーバーレイ（未翻訳の項目は韓国語のまま表示されます）。 */
export const ja: Overlay = {
  ui: {
    brand: { name: '牛島', sub: 'UDO' },
    states: { loading: '読み込み中…', error: '情報を取得できませんでした。', empty: '表示する内容がまだありません。', updatedAt: '基準時刻' },
    ferry: {
      title: '運航状況',
      today: '今日',
      tomorrow: '明日',
      lights: { green: '通常運航', yellow: '注意', red: '欠航', gray: '未確認' },
    },
  },
};
