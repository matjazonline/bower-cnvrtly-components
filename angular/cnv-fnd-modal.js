'use strict';

angular.module('cnvrtlyComponents')
  .directive('cnvFndModal', function () {
        return {
            //template: '<div></div>',
            restrict: 'A',
            compile: function compile(tElement, tAttrs, transclude) {
                $(tElement).attr("id","cnvFormModal")


                return function postLink(scope, element, attrs) {
                    $('#cnvFormModal').foundation('reveal', {
                        opened: function () {
                            scope.$broadcast("event:directive:cnvFndModal:opened")
                        },
                        closed: function () {
                            scope.$broadcast("event:directive:cnvFndModal:closed")
                        }
                    });
                }

            }
        };
    });
