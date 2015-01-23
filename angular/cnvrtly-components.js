'use strict';

angular.module('cnvrtlyComponents',[])
    .service('CnvrtlyComponents', ['$injector',function ($injector) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.dispatchUpdatedEvent=function() {
            if ($injector.has("EditableMessageChannel")) {
                var EditableMessageChannel = $injector.get("EditableMessageChannel")
                if (EditableMessageChannel)EditableMessageChannel.dispatchUpdatedEvent({})
            }
        }
        this.getPageId=function(){
            return $("head meta[name='tagyCmsPageId']").attr("content")
        }
        this.onCnvXScript=function(callbackFn,scope){
            var doCB=function(callbackFn){
                callbackFn({CnvXScript:window.CnvXScript,CnvXData:window.CnvXData,CnvXPopup:window.CnvXPopup})
            }
            if(window.CnvXScript!=null) {
                doCB(callbackFn)
            }else{
                $(document).on("CnvXScript",function(){
                    var cvFn=callbackFn
                    return function() {
                        scope.$apply(function () {
                            doCB(cvFn)
                        })
                    }
                }())
            }
        }
    }]);
