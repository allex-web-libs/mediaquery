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

