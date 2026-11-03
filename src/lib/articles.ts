import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;

export const categoryMeta: Record<string, { title: string; description: string }> = {
  finops: {
    title: 'FinOps',
    description:
      'Cloud cost, orphan resources, and the habits that keep agent-created infrastructure from billing after the session ends.',
  },
  notes: {
    title: 'Notes',
    description: 'Short site notes. This shelf exists so a second category has a real route.',
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

export function articlePath(id: string): string {
  return `/articles/${id}/`;
}

export function categoryPath(slug: string): string {
  return `/categories/${slug}/`;
}

export function articleCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'article' : 'articles'}`;
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
  description: string;
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
      description: categoryDescription(slug),
      articles: items,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}
