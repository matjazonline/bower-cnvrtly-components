'use strict';

angular.module('cnvrtlyComponents')
  .directive('cnvOpenForm', function () {
        return {
            //template: '<div></div>',
            restrict: 'A',
            compile: function compile(tElement, tAttrs, transclude) {
                $(tElement).attr("data-reveal-id","cnvFormModal")

                /*

                 $('body').append('<div id="subs-modal" class="reveal-modal" data-reveal>\
                 <h2>Enter your email</h2>                                    \
                 <p class="lead">Your couch.  It is mine.</p>                     \
                 <p>Im a cool paragraph that lives inside of an even cooler modal. Wins</p>\
                 <a class="close-reveal-modal">&#215;</a>                                   \
                 </div>')
                 $(document).foundation();
                 */

                return function postLink(scope, element, attrs) {

                    $(element).click(function(ev){
                        ev.preventDefault()
                        //$('#subs-modal').foundation('reveal', 'open')
                    })

                }

            }
            /*link: function postLink(scope, element, attrs) {
             $(element).click(function(ev){
             ev.preventDefault()
             $('#subs-modal').foundation('reveal', 'open', 'http://some-url')
             })
             }*/
        };
    });
