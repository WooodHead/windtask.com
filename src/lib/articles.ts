import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;
export type ArticleZh = CollectionEntry<'articleZh'>;

export const categoryMeta: Record<string, { title: string; titleZh: string; description: string; descriptionZh: string }> = {
  finops: {
    title: 'FinOps',
    titleZh: 'FinOps',
    description:
      'Cloud cost, orphan resources, and the habits that keep agent-created infrastructure from billing after the session ends.',
    descriptionZh: '云成本、无人认领的资源，以及避免代理创建的基础设施在会话结束后继续计费的习惯。',
  },
  privacy: {
    title: 'Privacy',
    titleZh: '隐私',
    description:
      'Account-type decisions for AI retention and monitoring: what self-assessment actually runs, what stays, and what you can turn off.',
    descriptionZh: '按账户类型决定 AI 的留存与监控：自评实际会运行什么、留下什么，以及你能关掉什么。',
  },
  notes: {
    title: 'Notes',
    titleZh: '笔记',
    description: 'Short site notes. This shelf exists so a second category has a real route.',
    descriptionZh: '站点短记。这个分类用来保证第二个分类有一条真实路径。',
  },
  security: {
    title: 'Security',
    titleZh: '安全',
    description:
      'Browser freshness, containment, and the trust decisions coding agents make when they open pages you did not write.',
    descriptionZh: '浏览器新鲜度、隔离，以及编程代理打开并非你所写的页面时做出的信任判断。',
  },
  'developer-tools': {
    title: 'Developer Tools',
    titleZh: '开发工具',
    description: 'Writing filed under Developer Tools.',
    descriptionZh: '归在开发工具下的文章。',
  },
};

export function categoryTitle(slug: string): string {
  return (
    categoryMeta[slug]?.title ??
    slug.replace(/(^|-)([a-z0-9])/g, (_match, _dash, char: string) => ` ${char.toUpperCase()}`).trim()
  );
}

export function categoryDescription(slug: string): string {
  return categoryMeta[slug]?.description ?? `Writing filed under ${categoryTitle(slug)}.`;
}

export function categoryTitleZh(slug: string): string {
  return categoryMeta[slug]?.titleZh ?? categoryTitle(slug);
}

export function categoryDescriptionZh(slug: string): string {
  return categoryMeta[slug]?.descriptionZh ?? `归在${categoryTitleZh(slug)}下的文章。`;
}

export function articlePath(id: string): string {
  return `/articles/${id}/`;
}

export function categoryPath(slug: string): string {
  return `/categories/${slug}/`;
}

export function articleCountLabel(count: number, lang: 'en' | 'zh' = 'en'): string {
  if (lang === 'zh') return `${count} 篇`;
  return `${count} ${count === 1 ? 'article' : 'articles'}`;
}

let zhMapPromise: Promise<Map<string, ArticleZh>> | undefined;

export function getZhMap(): Promise<Map<string, ArticleZh>> {
  zhMapPromise ??= getCollection('articleZh').then((entries) => {
    const map = new Map<string, ArticleZh>();
    for (const entry of entries) {
      const id = entry.id.endsWith('.zh') ? entry.id.slice(0, -3) : entry.id;
      map.set(id, entry);
    }
    return map;
  });
  return zhMapPromise;
}

export async function getArticles(): Promise<Article[]> {
  const articles = await getCollection('articles', ({ data }) => data.draft !== true);
  return articles.sort((a, b) => {
    const byDate = b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
    if (byDate !== 0) return byDate;
    if (a.data.sample !== b.data.sample) return a.data.sample ? 1 : -1;
    return a.data.title.localeCompare(b.data.title);
  });
}

export interface CategoryGroup {
  slug: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  articles: Article[];
}

export function groupByCategory(articles: Article[]): CategoryGroup[] {
  const groups = new Map<string, Article[]>();
  for (const article of articles) {
    const list = groups.get(article.data.category) ?? [];
    list.push(article);
    groups.set(article.data.category, list);
  }

  return [...groups.entries()]
    .map(([slug, items]) => ({
      slug,
      title: categoryTitle(slug),
      titleZh: categoryTitleZh(slug),
      description: categoryDescription(slug),
      descriptionZh: categoryDescriptionZh(slug),
      articles: items,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}
