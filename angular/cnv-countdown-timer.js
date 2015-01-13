'use strict';

angular.module('cnvrtlyComponents')
  .directive('cnvCountdownTimer',["$interval", function ($interval) {
        return {
            template: '<div>countdown TTT d={{countdownTimeLeft.d}} h={{countdownTimeLeft.h}} m={{countdownTimeLeft.m}} s={{countdownTimeLeft.s}}</div>',
            restrict: 'A',
            scope:true,
            link: function (scope, element, attrs) {
                $(element).append(attrs.cnvCountdownTimer)

                var getTimeLeft=function(msFrom,msTo){
                    var ret={ d: 0, h: 0, m: 0, s: 0 }
                    var difference=msTo-msFrom
                    if(difference>0 ){
                        //used simplified approach

                        /*var days = Math.floor((difference%(1000*60*60*24*7) / (1000*60*60*24))),
                            hours = Math.floor((difference%(1000*60*60*24) / (1000*60*60))),
                            minutes = Math.floor(difference % 36e5 / 60000),
                            seconds = Math.floor(difference % 60000 / 1000);

                        console.log("d=",days,"h=",hours,"m="+minutes,"s=",seconds)*/
                        var convertMS=function (ms) {
                            var d, h, m, s;
                            s = Math.floor(ms / 1000);
                            m = Math.floor(s / 60);
                            s = s % 60;
                            h = Math.floor(m / 60);
                            m = m % 60;
                            d = Math.floor(h / 24);
                            h = h % 24;
                            return { d: d, h: h, m: m, s: s };
                        };
                        return convertMS(difference)
                    }
                    return ret;
                }
                var getTimeLeftForDays=function(fromTimeMs,days){
                    var now=(new Date())//.getTime()
                    var dateToExpire=new Date(fromTimeMs)
                    dateToExpire.setDate(dateToExpire.getDate() + days)
                    return getTimeLeft(now.getTime(),dateToExpire.getTime())
                }
                var CnvXData=window.CnvXData
                var CnvUrl=window.CnvUrl
                scope.countdownTimeLeft=null//{ d: 0, h: 0, m: 0, s: 0 }
                var countdownToTime=null

                var daysUntillExpired=parseInt(attrs.cnvDays)
                var countdownInt=null

                var resetCountdownTime=function(){
                    if(countdownToTime==null&& daysUntillExpired<1)return
                    var timeLeft=getTimeLeftForDays(countdownToTime,daysUntillExpired)
                    if(timeLeft && timeLeft.s==0 && timeLeft.m==0 && timeLeft.h==0 && timeLeft.d==0){
                        clearInterval(countdownInt)
                        scope.countdownTimeLeft=null
                    }else{
                        if(timeLeft)scope.countdownTimeLeft=timeLeft
                    }
                    console.log("LEft=",scope.countdownTimeLeft)
                }
                var startCountdown=function(fromTime){
                    countdownToTime=fromTime
                    if(!countdownInt){
                        resetCountdownTime()

                        countdownInt=$interval(function(){
                            resetCountdownTime()
                        },1000)
                    }
                }

                if(daysUntillExpired>0&&CnvXData && CnvUrl){
                            var tagName=attrs.cnvCountdownTimer
                            var ns = CnvUrl.getQueryParams().ns
                            if(!ns)ns=attrs.cnvDomain
                            if(!ns)ns=attrs.cnvNs
                            if(!ns)ns=window.location.hostname

                            CnvUrl.getTag(tagName+"@"+ ns,function(tagVal){
                                if(tagVal){
                                    startCountdown(parseInt(tagVal.createdAt))
                                    scope.$apply()
                                }
                                console.log("tag=",tagVal)

                            })

                }else{
                    console.log("ERROR no CnvXScript classes or cnv-days attribute")
                }
            }
        };
    }]);
