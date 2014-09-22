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
  }]);
