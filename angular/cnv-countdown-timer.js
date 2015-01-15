'use strict';

angular.module('cnvrtlyComponents')
  .directive('cnvCountdownTimer',["$interval", function ($interval) {
        return {
            template: '<div ng-show="countdownTimeLeft!=null">' +
                '<ul>\
        <li class="countdown-pie " data-time-unit="d"><span class="time-val">{{countdownTimeLeft.d}}</span><span class="text">Days</span></li>\
        <li class="countdown-pie " data-time-unit="h"><span class="time-val">{{countdownTimeLeft.h}}</span><span class="text">Hours</span></li>\
        <li class="countdown-pie " data-time-unit="m"><span class="time-val">{{countdownTimeLeft.m}}</span><span class="text">Minutes</span></li>\
        <li class="countdown-pie " data-time-unit="s"><span class="time-val">{{countdownTimeLeft.s}}</span><span class="text">Seconds</span></li>\
        </ul>\
        ' +
                '</div>',
            restrict: 'A',
            scope:{
                cnvDays:'@'
            },
            link: function (scope, element, attrs) {
                var pieSize=140
                if($("#cnvCountdownTimerCss","head").length<1)$("head").prepend("<style id='cnvCountdownTimerCss' remove-in-production>.countdown-pie { display: inline-block; width:"+pieSize+"px; height: "+pieSize+"px; margin: 0 10px; vertical-align: top; position: relative; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; padding-top: 2px; text-align: center;} .countdown-pie .time-val { display: block; font-size: 4em; font-weight: normal; margin-bottom:-15px} .countdown-pie canvas { position: absolute; left: 0; top: 0; } .countdown-pie .text{line-height: 1em;font-size: 1.2em;}</style>")

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
                scope.$watch("countdownTimeLeft",function(val){
                    if(val) {
                        for (var key in pieCharts) {
                            var divide = 0
                            if (key == "m" || key == "s") {
                                divide = 60
                            } else if (key == "d") {
                                divide = daysUntillExpired
                            } else if (key == "h") {
                                divide = 24
                            }
                            pieCharts[key].update((val[key] / divide)*100)
                        }
                    }
                })
                var countdownToTime=null


                var daysUntillExpired=0//parseInt(scope.cnvDays)
                scope.$watch(function() {return element.attr('cnv-days'); },function(val){
                    if(val) {
                        var daysVal=parseInt(val)
                        if(daysVal>0){
                            daysUntillExpired=parseInt(val)
                            init()
                        }else if(isNaN( daysVal) ){
                            var ns = getNs();
                            if(!ns)return
                            CnvUrl.getTag(val+"@"+ ns,function(tagVal){
                                if(tagVal&&tagVal.value!=null){
                                    daysUntillExpired=parseInt(tagVal.value)
                                    init()
                                }
                                //console.log("tagVAL=",tagVal," for=",val)
                            })
                        }
                    }
                })
                var countdownInt=null

                var resetCountdownTime=function(){
                    if(countdownToTime==null&& daysUntillExpired<1)return
                    var timeLeft=getTimeLeftForDays(countdownToTime,daysUntillExpired)
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
                    var ns = CnvUrl.getQueryParams().ns
                    if(!ns)ns=attrs.cnvDomain
                    if(!ns)ns=attrs.cnvNs
                    if(!ns)ns=window.location.hostname
                    return ns
                }

                var init=function(){
                    if(attrs.cnvCountdownTimer!=null  && daysUntillExpired>0&&CnvXData && CnvUrl&& scope.cnvDays&& scope.cnvDays.length>0){
                        var tagName=attrs.cnvCountdownTimer
                        var ns = getNs()

                        CnvUrl.getTag(tagName+"@"+ ns,function(tagVal){
                            if(tagVal){
                                startCountdown(parseInt(tagVal.createdAt))
                                scope.$apply()
                            }
                            //console.log("tag=",tagVal)

                        })

                    }else{
                        //console.log("cnvCountdownTimer init - no CnvXScript classes or no cnv-days or cnv-ns or cnv-Countdown-Timer attribute")
                    }
                }
                init()
            }
        };
    }]);
