'use strict';

angular.module('cnvrtlyComponents')
  .directive('cnvTimer',["$interval","CnvrtlyComponents", function ($interval,CnvrtlyComponents) {
        return {
            template: '<div ng-show="countdownTimeLeft!=null">' +
                '<ul>\
        <li class="countdown-pie " data-time-unit="d"><span class="time-val">{{countdownTimeLeft.d}}</span><span class="text">Days</span></li>\
        <li class="countdown-pie " data-time-unit="h"><span class="time-val">{{countdownTimeLeft.h}}</span><span class="text">Hours</span></li>\
        <li class="countdown-pie " data-time-unit="m"><span class="time-val">{{countdownTimeLeft.m}}</span><span class="text">Minutes</span></li>\
        <li class="countdown-pie " data-time-unit="s"><span class="time-val">{{countdownTimeLeft.s}}</span><span class="text">Seconds</span></li>\
        </ul>\
        ' +
                '<div ng-transclude></div></div>',
            restrict: 'A',
            transclude: true,
            scope:{
                cnvStartOn:'@'
                ,cnvStop:'@'
                ,cnvTimer:'@'
            },
            link: function (scope, element, attrs) {
                var pieSize=140
                var countdownInt=null

                if($("#cnvTimerCss","head").length<1)$("head").prepend("<style id='cnvTimerCss' remove-in-production>.countdown-pie { display: inline-block; width:"+pieSize+"px; height: "+pieSize+"px; margin: 0 10px; vertical-align: top; position: relative; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; padding-top: 2px; text-align: center;} .countdown-pie .time-val { display: block; font-size: 4em; font-weight: normal; margin-bottom:-15px} .countdown-pie canvas { position: absolute; left: 0; top: 0; } .countdown-pie .text{line-height: 1em;font-size: 1.2em;}</style>")

                var easyPieOptions = {
                    scaleColor: false,
                    trackColor: 'rgba(255,255,255,0.3)',
                    barColor: '#E7F7F5',
                    lineWidth: 16,
                    lineCap: 'butt',
                    size: pieSize,
                    animate:false
                };
                var pieCharts={}
                var initPieCharts=function(){
                    $(".countdown-pie",element).each(function(i,obj){
                        var $obj=$(obj)
                        var pieChart = new EasyPieChart(obj, easyPieOptions);
                        pieChart.update(0)
                        pieCharts[$obj.data("timeUnit")]=( pieChart);
                    })
                }
                initPieCharts()

                    var getTimeLeft=function(msFrom,msTo){
                    var ret={ d: 0, h: 0, m: 0, s: 0 }
                    var difference=msTo-msFrom
                    if(difference>0 ){
                        //used simplified approach

                        /*var days = Math.floor((difference%(1000*60*60*24*7) / (1000*60*60*24))),
                            hours = Math.floor((difference%(1000*60*60*24) / (1000*60*60))),
                            minutes = Math.floor(difference % 36e5 / 60000),
                            seconds = Math.floor(difference % 60000 / 1000);

                        //console.log("d=",days,"h=",hours,"m="+minutes,"s=",seconds)*/
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
                var CnvXData=null
                var CnvXScript=null
                var CnvXUtils=null
                scope.countdownTimeLeft=null//{ d: 0, h: 0, m: 0, s: 0 }
                scope.$watch("countdownTimeLeft",function(val){
                    if(val) {
                        for (var key in pieCharts) {
                            var divide = 0
                            if (key == "m" || key == "s") {
                                divide = 60
                            } else if (key == "d") {
                                divide = cnvTimerStop
                            } else if (key == "h") {
                                divide = 24
                            }
                            pieCharts[key].update((val[key] / divide)*100)
                        }
                    }
                })
                var countdownToTime=null


                var cnvTimerStop=0

                var setCdwnEndTime=function(val){
                    if(val!=null && (val>0 || val.length>0)) {
                        //var daysVal=parseInt(val)
                        getValueOrTagValue(val,'value',function(res){

                            //console.log("TTTT setCdwnEndTime RESSS called=",res)
                            if(res){
                                cnvTimerStop=res
                                init()
                            }
                        })
                    }
                }
                scope.$watch("cnvTimer",function(val){
                    if(val)scope.cnvStartOn=val
                })
                scope.$watch("cnvStop",function(val){
                    if(val!=null) {
                        setCdwnEndTime(val)
                    }else{
                        if(cnvTimerStop==0)cnvTimerStop=scope.cnvStop=window.cnvTimerStop
                        setCdwnEndTime(cnvTimerStop)
                    }
                })


                scope.$watch("cnvStartOn",function(val){
                    if(!val) {
                        scope.cnvStartOn=window.cnvTimerStart
                        if(window.cnvTimerStop)scope.cnvStop=window.cnvTimerStop
                    }
                    if(val&&scope.cnvStop==null) {
                        scope.cnvStop=val
                    }
                })

                var resetCountdownTime=function(){
                    if(countdownToTime==null&& cnvTimerStop<1)return
                    var timeLeft=getTimeLeftForDays(countdownToTime,cnvTimerStop)
                    if(timeLeft && timeLeft.s==0 && timeLeft.m==0 && timeLeft.h==0 && timeLeft.d==0){
                        clearInterval(countdownInt)
                    }
                    if(timeLeft)scope.countdownTimeLeft=timeLeft

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

                var getNs=function(){
                    var ns = CnvXUtils?CnvXUtils.getQueryParams().ns:null
                    if(!ns)ns=attrs.cnvDomain
                    if(!ns)ns=attrs.cnvNs
                    if(!ns)ns=window.cnvNs
                    if(!ns)ns=window.location.hostname

                    return ns
                }


                var getValueOrTagValue=function(valOrTagName,tagPropName,callbackFn){
                    try {
                        //if start is as dd/mm/YYY
                        var slInd = valOrTagName.indexOf("/");
                        if (slInd && slInd > 0) {
                            var d = new Date(valOrTagName)
                            if (d) {
                                callbackFn(d.getTime())
                                return
                            }
                        }
                    }catch(e){}

                    var daysVal=parseInt(valOrTagName)
                    if(daysVal>0){
                        callbackFn(daysVal)
                    }else if(isNaN( daysVal) ){
                        if(!CnvXScript){
                            //console.log("TTTTTT no CnvXScript")
                            callbackFn(null)
                            return
                        }
                        if(CnvXUtils&&CnvXUtils.getQueryParams().debug)console.log("TTTTTT getValueOrTagValue getTag call t=",valOrTagName,getNs())
                        CnvXScript.getTag(valOrTagName+"@"+ getNs(),function(tagVal){
                            if(CnvXUtils&&CnvXUtils.getQueryParams().debug)console.log("TTTTTT  getTAGGG res=",tagVal)
                            if(tagVal){
                                callbackFn(parseInt(tagVal[tagPropName]))
                            }else{
                                callbackFn(null)
                            }
                        })

                    }
                }

                var init=function(){
                    if(scope.cnvStartOn!=null  && cnvTimerStop>0&&CnvXData && CnvXScript&& scope.cnvStop!=null&& (scope.cnvStop.length>0 || scope.cnvStop>0)){
                        var tagName=scope.cnvStartOn
                        getValueOrTagValue(tagName,'createdAt',function(res){
                            if(CnvXUtils&&CnvXUtils.getQueryParams().debug)console.log("cnvTimer startCountdown =",res)
                        if(res){
                            startCountdown(res)
                        }
                        })
                    }else{
                        ////console.log("cnvTimer init - no CnvXScript classes or no cnv-days or cnv-ns or cnv-Countdown-Timer attribute")
                    }
                }

                CnvrtlyComponents.onCnvXScript(function(xScript){
                    CnvXData=xScript.CnvXData
                    CnvXScript=xScript.CnvXScript
                    CnvXUtils=xScript.CnvXUtils


                            //call to set end time from tag name - it calls init()

                            //console.log("TTTT cnvXScript called -------- end time",scope.cnvStop)
                    if(CnvXUtils&&CnvXUtils.getQueryParams().debug)console.log("cnvTimar onCnvXScript setting end time=",scope.cnvStop)
                            setCdwnEndTime(scope.cnvStop)


                },scope)


                var onTimerHandler = function (ev, start, end) {
                    if(CnvXUtils&&CnvXUtils.getQueryParams().debug)console.log("cnvTimer onTimerHandler event")
                    if (!scope.cnvStartOn && start) {
                        if(CnvXUtils&&CnvXUtils.getQueryParams().debug)console.log("on cnvTimer event - call init =",start)
                        scope.$apply(function () {
                            if (end!=null)scope.cnvStop = end
                            scope.cnvStartOn = start
                        })
                    }

                };
                $(document).on("cnvTimer", onTimerHandler)
                $(element).on("cnvTimer", onTimerHandler)

            }
        };
    }]);
