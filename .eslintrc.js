module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: "standard",
  overrides: [
    {
      env: {
        node: true
      },
      files: [".js"],
      parserOptions: {
        sourceType: "script"
      }
    }
  ],
  parserOptions: {
    ecmaVersion: "latest"
  },
  rules: {
    quotes: ["error", "double"],
    semi: ["error", "always"]
  }
};
