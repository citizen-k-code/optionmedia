import { defineConfig } from 'astro/config';

// GitHub Pages project site: https://<user>.github.io/optionmedia/
export default defineConfig({
  site: 'https://optionmedia.github.io',
  base: '/optionmedia',
  trailingSlash: 'ignore',
});
