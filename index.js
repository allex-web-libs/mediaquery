(function createMediaQueryWebLib (execlib) {
  var mylib = {};
  require('./creator')(execlib, mylib);
  execlib.execSuite.libRegistry.register('allex_mediaqueryweblib', mylib);
})(ALLEX);
