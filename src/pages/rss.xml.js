import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

const parser = new MarkdownIt();

export async function GET(context) {
  const posts = await getCollection('posts');

  // Filter out future-dated posts and sort by date descending
  const now = new Date();
  const publishedPosts = posts
    .filter(post => post.data.date <= now)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'Pedro Figueira - Blog',
    description: 'Thoughts on research, technology, and nomadic life',
    site: context.site,
    items: publishedPosts.map(post => {
      // Generate permalink (same logic as posts page)
      const permalink = post.data.permalink || (() => {
        const date = post.data.date;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const postName = post.id.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
        return `/posts/${year}/${month}/${postName}/`;
      })();

      // Extract first paragraph for description
      const firstParagraph = post.body
        .split('\n\n')
        .find(p => p.trim() && !p.startsWith('#'));
      const description = firstParagraph
        ? firstParagraph.substring(0, 160).trim() + '...'
        : post.data.title;

      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: description,
        link: permalink,
        content: sanitizeHtml(parser.render(post.body), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        }),
        categories: post.data.tags || [],
      };
    }),
  });
}
