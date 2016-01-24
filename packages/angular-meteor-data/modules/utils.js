angular.module('angular-meteor.utils', [])


.service('$$utils', [
  '$rootScope',

function($rootScope) {
  this.isCursor = (obj) => {
    return obj instanceof Meteor.Collection.Cursor;
  };

  this.isScope = (obj) => {
    return obj instanceof $rootScope.constructor;
  };

  this.areSiblings = (obj1, obj2) => {
    return _.isObject(obj1) && _.isObject(obj2) &&
      Object.getPrototypeOf(obj1) === Object.getPrototypeOf(obj2);
  };

  this.bind = (fn, context, tap) => {
    tap = _.isFunction(tap) ? tap : angular.noop;
    if (_.isFunction(fn)) return bindFn(fn, context, tap);
    if (_.isObject(fn)) return bindObj(fn, context, tap);
    return fn;
  };

  let bindFn = (fn, context, tap) => {
    return (...args) => {
      let result = fn.apply(context, args);
      tap.call(context, {result, args});
      return result;
    };
  };

  let bindObj = (obj, context, tap) => {
    return _.keys(obj).reduce((bound, k) => {
      bound[k] = this.bind(obj[k], context, tap);
      return bound;
    }, {});
  };
}]);
