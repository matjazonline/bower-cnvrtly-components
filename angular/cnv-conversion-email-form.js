'use strict';

angular.module('cnvrtlyComponents')
    .directive('cnvConversionEmailForm', ['$http','$rootScope','CnvrtlyComponents', function ($http,$rootScope,CnvrtlyComponents) {
        return {
            //scope:false,
            require:'form',
            restrict: 'A',
            template:'',
            link: function postLink(scope, element, attrs,formCtrl) {
                scope.form=formCtrl
                scope.submitCalled=false
                element=$(element)
                var newElementAdded=false
                var emailField=element.find('input[name="email"]')


                if(emailField==null||emailField.length<1)emailField=element.find(".email")
                if(emailField.length<1){
                    emailField=$('<input type="email" class="email" value=""/>')
                    element.prepend(emailField)
                    newElementAdded=true
                }
                if(emailField)scope.emailField=emailField

                var submitBtn=element.find(".submit")
                if(submitBtn.length<1)submitBtn=element.find("a.submit")
                if(submitBtn.length<1){
                    submitBtn=$('<button type="submit" class="submit">submit</button>')
                    element.append(submitBtn)
                    newElementAdded=true
                }
                if(newElementAdded) CnvrtlyComponents.dispatchUpdatedEvent();
                var formEl=element.find("form");
                if(formEl.length<1){
                    /*console.log("mp-conversion-email-form element",element)
                     console.log("mp-conversion-email-form  element.is, $", element.is)
                     console.log("mp-conversion-email-form  $",$)*/
                    if(element.is("form"))formEl=element;
                }

                var getPostURL=function(){
                    var baseTag=document.getElementById("baseTag")
                    var baseTagPath=baseTag?baseTag.href:null
                    var baseDomain=""
                    if(baseTagPath) {
                        baseDomain=baseTagPath.substring(baseTagPath.lastIndexOf("//")+2,baseTagPath.lastIndexOf("/"))
                        var portCol = baseDomain.indexOf(':');
                        if(portCol>0)baseDomain=baseDomain.substring(0,portCol)
                    }
                    var prep=window.location.port=='9000'?window.location.protocol+'//'+window.location.hostname+":8080":window.location.origin
                    var pageId=CnvrtlyComponents.getPageId()
                    var postURL = prep + "/subscribe/" + pageId;
                    if(baseDomain.length>0)postURL=postURL+'?ns='+baseDomain
                    //console.log("postURL=",postURL)
                    return postURL
                }
                scope.submitForm=function(){
                    var emailAddr=emailField.val()
                    if(!scope.form.$valid){
                        scope.$apply( function(){
                            scope.submitCalled=true
                        })
                        return
                    }
                    $rootScope.$broadcast("event:directive:emailListIntegrationForm:subscribe:progress")
                    var params = {email: emailAddr,dataArr:[]};

                    function addValueToParams(keyName, elemValue, keyNames, dataArr) {
                           if (keyName == null || keyName.length < 1)keyName = "no_title_1"
                            while (keyNames[keyName] != null) {
                                var keyNr = -1
                                var keyNrDivider = keyName.lastIndexOf('_');
                                var newKey = null
                                if (keyNrDivider > 0) {
                                    keyNr = keyName.substr(keyNrDivider + 1)
                                    var nrParsed = parseInt(keyNr);
                                    if (isNaN(nrParsed)) {
                                        keyNr = 1
                                    } else {
                                        keyNr++
                                    }
                                    newKey = keyName.substr(0, keyNrDivider) + '_' + keyNr
                                }
                                if (keyNr < 1)keyNr = 1
                                if (newKey == null)newKey = keyName + '_' + keyNr.toString()
                                keyName = newKey
                            }
                            if(elemValue==null)elemValue=''
                            keyNames[keyName] = true
                            var valObj={}
                            valObj[keyName]=elemValue
                            dataArr.push(valObj)
                    }
                    var keyNames={}
                    var formElements=formEl.find("input, textarea, select")
                    for (var i = 0; i < formElements.length; i++) {
                        var elem = formElements[i];
                        var $elem = $(elem)
                        var key = $elem.attr('name');
                        if($elem.attr("type")!="submit"||$elem.attr("mp-ignore")!=null){
                            var elemValue = null
                            if($elem.attr('type')=="checkbox"){
                                elemValue=$elem.is(':checked').toString()
                            }else if($elem.attr('type')=="radio"){
                                if($elem.is(':checked')){
                                    elemValue=$elem.val()
                                }else{
                                    continue;
                                }
                            }
                            else{
                                elemValue=$elem.val();
                            }
                            addValueToParams(key, elemValue,keyNames,params.dataArr);
                        }
                    }
                    $http.post(getPostURL(), params).success(function(res){
                        if(res.success==true) {
                            if(res.url==null || res.url.length<1){
                                $rootScope.$broadcast("event:directive:emailListIntegrationForm:subscribe:success",null)
                            }else{
                                $rootScope.$broadcast("event:directive:emailListIntegrationForm:subscribe:success",res.url)
                                window.location.href=res.url
                            }
                        }else{
                            $rootScope.$broadcast("event:directive:emailListIntegrationForm:subscribe:error")
                        }
                    }).error(function(){
                        $rootScope.$broadcast("event:directive:emailListIntegrationForm:subscribe:error")
                    })
                }
                $("input", formEl).keypress(function(event) {
                    if (event.which == 13) {
                        event.preventDefault();
                        scope.submitForm();
                    }
                });
                formEl.submit(scope.submitForm)
                submitBtn.click(scope.submitForm)

                scope.$on("event:directive:cnvConversionEmailForm:submit",scope.submitForm)
            }
        };
    }]);
