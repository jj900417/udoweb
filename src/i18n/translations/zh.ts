import type { Overlay } from '..';

/* 中文覆盖层（未翻译的条目将显示韩文原文）。 */
export const zh: Overlay = {
  ui: {
    brand: { name: '牛岛', sub: 'UDO' },
    states: { loading: '加载中…', error: '无法加载信息。', empty: '暂无内容。', updatedAt: '截至' },
    ferry: {
      title: '运航状态',
      today: '今天',
      tomorrow: '明天',

    },
  },
};
