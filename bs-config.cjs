/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For more details about the options:
 |   https://browsersync.io/docs/options
 |
 */
module.exports = {
  server: "./dist",
  port: 3000,
  files: ["./dist/**/*"],
  open: true,
  notify: false,
  ui: false,
  watchEvents: ["change"],
  watch: true,
  ignore: [],
  single: true,
  codeSync: true,
  reloadOnRestart: true,
  reloadDelay: 0,
  injectChanges: true
}; 