import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';

export default [
  { languageOptions: { globals: { confirm: true } } },
  pluginJs.configs.recommended,
  pluginReactConfig,
];
