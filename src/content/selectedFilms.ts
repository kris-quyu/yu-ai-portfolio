export interface SelectedFilm {
  id: string;
  title: string;
  titleZh: string;
  summary: string;
  focus: string;
  duration: string;
}

export const selectedFilms: readonly SelectedFilm[] = [
  {
    id: 'beauty', title: 'BEAUTY FILM', titleZh: '美妆视觉短片', duration: '00:20',
    summary: '通过黑白空间、人物镜头与产品特写，建立统一的美妆视觉表达。',
    focus: '人物与产品叙事 / CHARACTER & PRODUCT',
  },
  {
    id: 'jewelry', title: 'JEWELRY FILM', titleZh: '珠宝产品短片', duration: '00:23',
    summary: '围绕珠宝形态、材质与微距细节，组织产品展示镜头。',
    focus: '产品细节与运镜 / DETAIL & CAMERA',
  },
  {
    id: 'footwear', title: 'FOOTWEAR FILM', titleZh: '鞋履产品短片', duration: '00:22',
    summary: '从鞋履细节到日常穿着场景，连接产品展示与使用情境。',
    focus: '产品与使用场景 / PRODUCT & LIFESTYLE',
  },
  {
    id: 'fashion', title: 'FASHION FILM', titleZh: '男装穿搭短片', duration: '00:15',
    summary: '以街景、人物动作与服装细节，呈现统一的穿搭氛围。',
    focus: '人物与服装表达 / CHARACTER & STYLING',
  },
];
