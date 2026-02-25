export default {
  locales: ['en', 'ru', 'uz'],
  output: 'src/locales/$LOCALE/translation.json',
  createOldCatalogs: false,
  keepRemoved: false,
  sort: true,
  useKeysAsDefaultValue: true,
  keySeparator: false,
  namespaceSeparator: false,
  lexers: {
    jsx: ['JsxLexer'],
    js: ['JavascriptLexer'],
  }
};
