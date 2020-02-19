(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function createMediaQueryMixin (execlib, mylib) {
  'use strict';

  var lib = execlib.lib;

  function MediaMatcher (querystring, cb) {
    if (!lib.isFunction(cb)) {
      throw new lib.Error('NOT_A_FUNCTION', 'MediaMatcher needs a function in its constructor');
    }
    this.match = window.matchMedia(querystring);
    this.cb = cb;
    this.triggerer = this.trigger.bind(this);
    this.triggerer(this.match);
    this.match.addListener(this.triggerer);
  }
  MediaMatcher.destroy = function () {
    if (this.triggerer && this.match) {
      this.match.removeListener(this.triggerer);
    }
    this.triggerer = null;
    this.cb = null;
    this.match = null;
  }
  MediaMatcher.prototype.trigger = function (match) {
    if (!lib.isFunction(this.cb)) {
      return;
    }
    this.cb(match.matches);
  };

  function MediaQueryMixin () {
    this.mediaQueryListeners = [];
  }
  MediaQueryMixin.prototype.destroy = function () {
    if (lib.isArray(this.mediaQueryListeners)) {
      lib.arryDestroyAll(this.mediaQueryListeners);
    }
    this.mediaQueryListeners = null;
  };
  MediaQueryMixin.prototype.addMediaQuery = function (querystring, cb) {
    if ('undefined' === typeof window) {
      return;
    }
    this.mediaQueryListeners.push(new MediaMatcher (querystring, cb));
  };
  MediaQueryMixin.prototype.initializeMediaQueries = function () {
    var mqs = this.getConfigVal('media_queries');
    if (!(lib.isArray(mqs) && mqs.length>0)) {
      return;
    }
    mqs.forEach(mqadder.bind(this));
  };

  function mqadder(mqdesc) {
    if (!mqdesc) {
      return;
    }
    if (!mqdesc.query) {
      return;
    }
    if (lib.isString(mqdesc.property) && mqdesc.property.length>0) {
      this.addMediaQuery(mqdesc.query, this.set.bind(this, mqdesc.property));
      return;
    }
    if (lib.isFunction(mqdesc.cb)) {
      this.addMediaQuery(mqdesc.query, mqdesc.cb);
    }
  }

  MediaQueryMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, MediaQueryMixin
      ,'addMediaQuery'
      ,'initializeMediaQueries'
    );
    klass.prototype.postInitializationMethodNames = klass.prototype.postInitializationMethodNames.concat('initializeMediaQueries');
  };

  mylib.MediaQueryMixin = MediaQueryMixin;
}
module.exports = createMediaQueryMixin;


},{}],2:[function(require,module,exports){
(function createMediaQueryWebLib (execlib) {
  var mylib = {};
  require('./creator')(execlib, mylib);
  execlib.execSuite.libRegistry.register('allex_mediaqueryweblib', mylib);
})(ALLEX);

},{"./creator":1}]},{},[2]);
