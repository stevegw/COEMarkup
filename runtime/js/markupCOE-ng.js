if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
  module.exports = 'markupcoe-ng';
}

(function () {
  'use strict';

  var markupcoeModule = angular.module('markupcoe-ng', []);
  markupcoeModule.directive('ngMarkupcoe', ['$timeout', '$interval', '$http', '$window', '$injector', ngMarkupcoe]);

  function ngMarkupcoe($timeout, $interval, $http, $window, $injector) {

    return {
      restrict: 'EA',
      scope: {
        autolaunchField: '@',
        markupField: '@',
        markedupField: '=',
        markedupdataField: '=',
        sessionimagesField: '=',
        includeborderField: '@',
        includedatestampField: '@',
        takenphotoField: '=',
        delegateField: '='
      },
      template: '<div></div>',
      link: function (scope, element, attr) {

        var lastUpdated = 'unknown';

        scope.data = { name: undefined, 
                   disabled: false, 
                        src: undefined,
                        markedup: undefined,
                        sessionimages: []
                     };

        scope.renderer = $window.cordova ? vuforia : $injector.get('threeJsTmlRenderer');

        var photocallback = function (pngBase64String) {

          scope.takenphotoField = 'data:image/png;base64,' + pngBase64String;        // define the size for the image widget
          scope.$applyAsync();
      
        };
      
      
        var takeScreenShot = function(showAugmentation ) {
          var params = {withAugmentation: showAugmentation};
          scope.renderer.takeScreenshot(params, photocallback, null);
      
          }
      
                     
        var executeMarkup = function() {
          console.log('do the markup');
          if (!scope.data.disabled) {
            let markup = new Markup(scope,scope.markupField ,  scope.includeborderField, scope.includedatestampField);

          } else {
            console.log('disabled');

          }
        };



        var executeTakePhoto = function () {

          takeScreenShot(true);
        
        }

        
        var start = function() {
          console.log('Starting markup');
          scope.data.disabled = false;
          scope.$parent.fireEvent('markStart');
          executeMarkup();
        }
        var takephoto = function() {
          console.log('Starting takephoto');
          scope.data.disabled = false;
          executeTakePhoto();
          scope.$parent.fireEvent('photoTaken');
          
        }
        

        scope.$watch('markedupdataField', function () {
          console.log('markedupdataField changed');

        });


        scope.$watch('markedupField', function () {
          console.log('markedupField changed');

          if (scope.markupField != undefined && scope.markupField != '') {
            scope.data.src = scope.markupField;
          }

        });

        scope.$watch('sessionimagesField', function () {
          console.log('sessionimagesField changed');

        });


        scope.$watch('markupField', function () {
          console.log('markupField changed');

          if (scope.autolaunchField == "true") {
            if (scope.markupField != undefined && scope.markupField != '') {
              scope.data.src = scope.markupField;
              start();
            }
          }

        });

        scope.$watch('takenphotoField', function () {
          console.log('takenphotoField ' + scope.takenphotoField );

        });

        scope.$watch('delegateField', function (delegate) {
          if (delegate) {
            delegate.start = function () { 
              start(); 
            };
            delegate.takephoto = function () { 
              takephoto(); 
            };

          }
        });

        // Use this initially to see if your extension get deployed
        // If you don't see this message its not deployed
        // Comment out once you have it working
        // scope.$watch( function() {
        //   console.log("Any watch "); 
        // });
      }
    };
  }




}());
