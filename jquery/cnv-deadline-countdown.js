'use strict';
(function ( $ ) {
    $.fn.cnvDeadlineCountdown = function (options) {

        var self=this

        var settings = $.extend({
            cnvStartOn:self.attr('cnv-start-on')
            ,cnvStop:self.attr('cnv-stop')
            //,cnvTimer:self.attr('cnv-timer')
        }, options );

        var template=   '<div class="countdown-w" style="display: none;">' +
                            '<ul>'+
                                '<li class="countdown-pie " data-time-unit="d"><span class="time-val">0</span><span class="text">Days</span></li>'+
                                '<li class="countdown-pie " data-time-unit="h"><span class="time-val">0</span><span class="text">Hours</span></li>'+
                                '<li class="countdown-pie " data-time-unit="m"><span class="time-val">0</span><span class="text">Minutes</span></li>'+
                                '<li class="countdown-pie " data-time-unit="s"><span class="time-val">0</span><span class="text">Seconds</span></li>'+
                            '</ul>'+
                        '</div>'

        var pieSize=140
        var countdownInt=null

        if($("#cnvTimerCss","head").length<1)$("head").prepend("<style id='cnvTimerCss' remove-in-production>.countdown-pie { display: inline-block; width:"+pieSize+"px; height: "+pieSize+"px; margin: 0 10px; vertical-align: top; position: relative; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; padding-top: 2px; text-align: center;} .countdown-pie .time-val { display: block; font-size: 4em; font-weight: normal; margin-bottom:-15px} .countdown-pie canvas { position: absolute; left: 0; top: 0; } .countdown-pie .text{line-height: 1em;font-size: 1.2em;}</style>")

        self.append(template)

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
            $(".countdown-pie",self).each(function(i,obj){
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
        var countdownTimeLeft=null//{ d: 0, h: 0, m: 0, s: 0 }

        var onCountdownTimeLeft=function(val){
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
        }
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


        var onCnvTimer=function(val){
            //if(val)settings.cnvStartOn=val
            if(val)setCnvStartOn(val)
        }
        var setCnvStop=function(val){

            if(settings.cnvStop!=val){
                settings.cnvStop=val
                onCnvStop(val)
            }
        }

        var onCnvStop=function(val){
            if(val!=null) {
                setCdwnEndTime(val)
            }else{
                //if(cnvTimerStop==0)cnvTimerStop=settings.cnvStop=window.cnvTimerStop
                if(cnvTimerStop==0)cnvTimerStop=setCnvStop(window.cnvTimerStop)
                setCdwnEndTime(cnvTimerStop)
            }
        }


        var setCnvStartOn=function(val){
            if(settings.cnvStartOn!=val){
                settings.cnvStartOn=val
                onCnvStartOn(val)
            }
        }
        var onCnvStartOn=function(val){
            if(!val) {
                //settings.cnvStartOn=window.cnvTimerStart
                setCnvStartOn(window.cnvTimerStart)
                //if(window.cnvTimerStop)settings.cnvStop=window.cnvTimerStop
                if(window.cnvTimerStop)setCnvStop(window.cnvTimerStop)
            }
            if(val&&settings.cnvStop==null) {
                //settings.cnvStop=val
                setCnvStop(val)
            }
        }

        var updateView=function( ){
            countdownTimeLeft
            countdownTimeLeft?self.find('.countdown-w').show():self.find('.countdown-w').hide()
            for (var prop in countdownTimeLeft) {
                if (countdownTimeLeft.hasOwnProperty(prop)) {
                    self.find("[data-time-unit='"+prop+"'] .time-val").text(countdownTimeLeft[prop])
            }
        }
        }

        var resetCountdownTime=function(){
            if(countdownToTime==null&& cnvTimerStop<1)return
            var timeLeft=getTimeLeftForDays(countdownToTime,cnvTimerStop)
            if(timeLeft && timeLeft.s==0 && timeLeft.m==0 && timeLeft.h==0 && timeLeft.d==0){
                clearInterval(countdownInt)
            }
            if(timeLeft){
                countdownTimeLeft=timeLeft
                updateView()
            }
        }

        var startCountdown=function(fromTime){
            countdownToTime=fromTime
            if(!countdownInt){
                resetCountdownTime()

                countdownInt=setInterval(function(){
                    resetCountdownTime()
                },1000)
            }
        }

        var getNs=function(){
            var ns = window.CnvXUtils?window.CnvXUtils.getQueryParams().ns:null
            if(!ns)ns=self.attr('cnvDomain')
            if(!ns)ns=self.attr('cnvNs')
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
                if(!window.CnvXScript){
                    //console.log("TTTTTT no CnvXScript")
                    callbackFn(null)
                    return
                }
                if(window.CnvXUtils&&window.CnvXUtils.getQueryParams().debug)console.log("TTTTTT getValueOrTagValue getTag call t=",valOrTagName,getNs())
                window.CnvXScript.getTag(valOrTagName+"@"+ getNs(),function(tagVal){
                    if(window.CnvXUtils&&window.CnvXUtils.getQueryParams().debug)console.log("TTTTTT  getTAGGG res=",tagVal)
                    if(tagVal){
                        callbackFn(parseInt(tagVal[tagPropName]))
                    }else{
                        callbackFn(null)
                    }
                })

            }
        }

        var init=function(){
            if(settings.cnvStartOn!=null  && cnvTimerStop>0&&window.CnvXData && window.CnvXScript&& settings.cnvStop!=null&& (settings.cnvStop.length>0 || settings.cnvStop>0)){
                var tagName=settings.cnvStartOn
                getValueOrTagValue(tagName,'createdAt',function(res){
                    if(window.CnvXUtils&&window.CnvXUtils.getQueryParams().debug)console.log("settings.cnvTimer startCountdown =",res)
                    if(res){
                        startCountdown(res)
                    }
                })
            }else{
                ////console.log("settings.cnvTimer init - no CnvXScript classes or no cnv-days or cnv-ns or cnv-Countdown-Timer attribute")
            }
        }

        var onTimerHandler = function (ev, start, end) {
            if(CnvXUtils&&CnvXUtils.getQueryParams().debug)console.log("settings.cnvTimer onTimerHandler event")
            if (!settings.cnvStartOn&& start) {
                if(CnvXUtils&&CnvXUtils.getQueryParams().debug)console.log("on settings.cnvTimer event - call init =",start)
                //if (end!=null)settings.cnvStop = end
                    if (end!=null)setCnvStop(end)
                    //settings.cnvStartOn = start
                    setCnvStartOn (start)
            }

        };
        $(document).on("cnvTimer", onTimerHandler)
        $(self).on("cnvTimer", onTimerHandler)
        $(document).on("cnv:CnvXScript:display-complete", function(){
            setCdwnEndTime(settings.cnvStop)
        })

    };
    $(function(){
        $('.cnv-deadline-countdown').cnvDeadlineCountdown({})

    })

})(jQuery)