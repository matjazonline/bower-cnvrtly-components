'use strict';

angular.module('cnvrtlyComponents')
  .directive('cnvFbSubscribeForm', function () {
        return {
            //uses scope variables from cnvConversionEmailForm directive
            restrict: 'A',
            compile: function compile(tElement, tAttrs, transclude) {

                //$(document).foundation();


                return function postLink(scope, element, attrs) {

                    var getFBEmail=function(){
                        FB.login(function(response) {
                            if (response.status === 'connected') {
                                getFBDetails()
                            } else if (response.status === 'not_authorized') {
                            } else {
                            }
                        },{scope:'email'});
                    }

                    var showFBEmailBtn=function(){
                        if(scope.emailField){
                            var getFbEmailBtnElem=element.find(".facebook-email-get-btn")
                                if(getFbEmailBtnElem.length<1){
                                    element.append("<style>.facebook-email-get-btn { display: inline-block; background: #627aac url(http://icons.iconarchive.com/icons/danleech/simple/24/facebook-icon.png) left no-repeat; border-top: 1px solid #29447e; border-right: 1px solid #29447e; border-bottom: 1px solid #1a356e; border-left: none; height: auto; padding-right: 7px; padding-left: 29px; font-weight: bold; font-size: 13px; color: white; text-decoration: none; font-family: \" lucida grande\", tahoma, verdana, arial, sans-serif; line-height: 22px; cursor: pointer;}</style>")
                                    getFbEmailBtnElem=$("<a class='facebook-email-get-btn' style='color: white;margin: 20px;'>get email from Facebook</a>")
                                }
                            var getFbEmailTxt=element.find(".facebook-email-get-btn-text").text()
                            if(getFbEmailTxt.length>0)getFbEmailBtnElem.text(getFbEmailTxt)
                            $("<div/>").append(getFbEmailBtnElem).insertAfter(scope.emailField)
                                $(getFbEmailBtnElem).click(getFBEmail)
                        }
                    }
                    var getFBDetails=function(){
                        FB.api('/me', {fields: ['email', 'name']}, function(details) {
                            if(details.email!=null && details.email.length>0) {
                                scope.emailField.val(details.email)
                                scope.emailField.change()
                                if(element.find('input, textarea, select').length==1) {
                                    if(details.id&&details.id.length>0&& element.find('input[name="_fbid"]').length==0)$("<input type='hidden' name='_fbid'/>").insertAfter(scope.emailField).val(details.id)
                                     scope.$broadcast('event:directive:cnvConversionEmailForm:submit')

                                }else{
                                    if(details.id&&details.id.length>0 && element.find('input[name="_fbid"]').length==0)$("<input type='hidden' name='_fbid'/>").insertAfter(scope.emailField).val(details.id)
                                    //scope.$apply()
                                }
                            }
                        })
                    }


                    var initFBForm=function() {
                        var fbAppId = attrs.cnvFbSubscribeForm
                        try {
                            if ((fbAppId == null || fbAppId.length < 1 ) && window.fbEmailAppId != null)fbAppId = window.fbEmailAppId
                            if ((fbAppId == null || fbAppId.length < 1 ) && window.fbAppId != null)fbAppId = window.fbAppId
                        } catch (e) {
                        }
                        if(window.debug)console.log("cnv-fb-subscribe-form init fbId=",fbAppId)
                        if (fbAppId) {

                            if (window.fbAsyncInit == null) {
                                window.fbAsyncInit = function () {
                                    FB.init({
                                        appId: fbAppId,
                                        xfbml: false,
                                        version: 'v2.0'
                                    });
                                    onFbInit()
                                };
                                (function (d, s, id) {
                                    var js, fjs = d.getElementsByTagName(s)[0];
                                    if (d.getElementById(id)) {
                                        return;
                                    }
                                    js = d.createElement(s);
                                    js.id = id;
                                    js.src = "//connect.facebook.net/en_US/sdk.js";
                                    fjs.parentNode.insertBefore(js, fjs);
                                }(document, 'script', 'facebook-jssdk'));
                            }else{
                                onFbInit()
                            }
                        }
                    }

                    var onFbInit=function(){
                        if(window.debug)console.log("cnv-fb-subscribe-form onFbInit")
                        FB.getLoginStatus(function (response) {
                            if(window.debug)console.log("cnv-fb-subscribe-form onFbInit FB response=",response)
                            if (response.status === 'connected') {
                                var uid = response.authResponse.userID;
                                var accessToken = response.authResponse.accessToken;
                                showFBEmailBtn()//getFBDetails()
                            } else if (response.status === 'not_authorized') {
                                showFBEmailBtn()
                            } else {
                                showFBEmailBtn()
                            }
                        });
                    }

                    scope.$on("event:directive:cnvFndModal:opened",function(){
                        initFBForm();
                    })
                    scope.$on("event:directive:cnvFbSubscribeForm:init",function(){
                        initFBForm();
                    })
                }
            }
        };
    })