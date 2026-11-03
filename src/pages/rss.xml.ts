import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { articlePath, categoryTitle, getArticles } from '../lib/articles';
import { site } from '../lib/site';

export const GET: APIRoute = async (context) => {
  if (!context.site) {
    throw new Error('Set site in astro.config before building the RSS feed.');
  }

  const articles = await getArticles();

  return rss({
    title: site.name,
    description: site.description,
    site: context.site,
    trailingSlash: true,
    customData: '<language>en-us</language>',
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.pubDate,
      categories: [categoryTitle(article.data.category), ...article.data.tags],
      link: articlePath(article.id),
    })),
  });
};
