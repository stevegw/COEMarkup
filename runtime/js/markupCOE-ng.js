if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
  module.exports = 'markupcoe-ng';
}

(function () {
  'use strict';

  var markupcoeModule = angular.module('markupcoe-ng', []);
  markupcoeModule.directive('ngMarkupcoe', ['$timeout', '$http', ngMarkupcoe]);

  function ngMarkupcoe($timeout, $http) {

    return {
      restrict: 'EA',
      scope: {
        autolaunchField: '@',
        markupField : '@',
        markedupField: '=',
        markedupdataField: '=',
        includeborderField: '@',
        includedatestampField: '@'
      },
      template: '<div></div>',
      link: function (scope, element, attr) {

        var lastUpdated = 'unknown';
        scope.data = { name: undefined, 
                   disabled: false, 
                        src: undefined,
                        markedup: undefined 
                     };
                     
        var executeMarkup = function() {
          console.log('do the markup thang');
          if (!scope.data.disabled) {
            let markup = new Markup(scope,scope.markupField ,  scope.includeborderField, scope.includedatestampField);

          } else {
            console.log('disabled');

          }
        };
        var start = function() {
          console.log('Starting markup');
          scope.data.disabled = false;
          scope.$parent.fireEvent('markStart');
          executeMarkup();
        }

        scope.$watch('markedupField', function () {
          //console.log('markedupField='+ scope.markedupField);

          if (scope.markupField != undefined && scope.markupField != '') {
            scope.data.src = scope.markupField;
          }

        });

        scope.$watch('markupField', function () {
          console.log('markupField='+ scope.markupField);

          if (scope.autolaunchField == "true") {
            if (scope.markupField != undefined && scope.markupField != '') {
              scope.data.src = scope.markupField;
              start();
            }
          }

        });

        // Use this initially to see if your extension get deployed
        // If you don't see this message its not deployed
        // Comment out once you have it working
        scope.$watch( function() {
          console.log("Any watch "); 
        });
      }
    };
  }

}());
