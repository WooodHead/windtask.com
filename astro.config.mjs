// @ts-check
import { defineConfig, envField } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const wrapTables = {
  name: 'wrap-tables',
  element: {
    filter: ['table'],
    visit(node, ctx) {
      ctx.wrapNode(node, {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-scroll'] },
        children: [],
      });
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: 'https://windtask.com',
  output: 'static',
  trailingSlash: 'always',
  // Static pages do not use sessions. Leaving this off keeps deploy from
  // provisioning a Workers KV namespace.
  session: false,
  adapter: cloudflare({
    // Build-time image handling. Avoids auto-provisioning a Cloudflare Images binding.
    imageService: 'compile',
  }),
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  markdown: {
    processor: satteri({
      hastPlugins: [wrapTables],
    }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      PUBLIC_ADSENSE_CLIENT: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: '',
      }),
      PUBLIC_ADSENSE_SLOT: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: '',
      }),
    },
  },
});
