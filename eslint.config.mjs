import nextVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextVitals,
  {
    rules: {
      // Static export with unoptimized images, so next/image adds nothing here.
      '@next/next/no-img-element': 'off',
      // Pages-router rule; fonts load from the root App Router layout.
      '@next/next/no-page-custom-font': 'off',
    },
  },
  {
    ignores: ['out/**', '.next/**', 'server/**', 'scripts/**', 'node_modules/**'],
  },
];

export default config;
