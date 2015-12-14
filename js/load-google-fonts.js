window.CnvFonts=(function(doc ) {
    var js,
        elTagName='link'
    fjs = (doc.getElementsByTagName(elTagName)[0]||doc.head),
        add = function(cssElementSelector,url, cssFontTitle,cssProps, maxFontSize) {
            var fontWeightArr,fontSize,fontSubset;
            if( cssElementSelector=="title"){
                cssFontTitle=!cssFontTitle?$('meta[name="titleGoogleFont"]',document.head).attr("content"):cssFontTitle;
                maxFontSize=!maxFontSize?$('meta[name="titleFontSize"]',document.head).attr("content"):maxFontSize;
            }else if(!cssFontTitle && cssElementSelector=="paragraph"){
                cssFontTitle=!cssFontTitle?$('meta[name="paragraphGoogleFont"]',document.head).attr("content"):cssFontTitle;
                maxFontSize=!maxFontSize?$('meta[name="paragraphFontSize"]',document.head).attr("content"):maxFontSize;
            }
            //console.log("FONTS=",cssFontTitle)
            if(cssFontTitle.toString().indexOf(':')) {
                var fWArr = cssFontTitle.toString().split(':');
                cssFontTitle = fWArr[0];
                if(isNaN(fWArr[1])){
                    fontSubset = fWArr[1];
                    fontWeightArr = fWArr.slice(2);
                }else{
                    fontWeightArr = fWArr.slice(1);
                }
            }
            if(maxFontSize){
                var mFSArr = maxFontSize.toString().split(':');
                fontSize = mFSArr[0];
                if(!fontWeightArr)fontWeightArr = mFSArr.slice(1);
            }
            if (!cssFontTitle && doc.getElementById(cssFontTitle)) {return;}

            var toFontWeightCss = function (ind, fontWArr) {
                if (fontWArr && fontWArr.length) {
                    if (ind > fontWArr.length) {
                        ind = fontWArr.length;
                    }
                    return 'font-weight:' + fontWArr[ind - 1] + ';'
                }
                return '';
            };
            js = doc.createElement(elTagName);
            //if(elTagName=='link'){
            //fonts.googleapis.com/css?family=Quicksand:400&subset=latin
            js.href = "//fonts.googleapis.com/css?family=" + cssFontTitle.replace(' ', '+');
            if(fontWeightArr && fontWeightArr.length){
                var fWeightDist = [];
                for (var i = 0; i < fontWeightArr.length; i++) {
                    if(fWeightDist.indexOf((fontWeightArr[i]).trim())<0){
                        fWeightDist.push(fontWeightArr[i]);
                    }
                }
                js.href+=':'+fWeightDist.join(',');
            }
            if(fontSubset) {
                js.href += '&subset=' + fontSubset;
            }
            js.type="text/css";
            js.rel="stylesheet";
            js['remove-in-production']="true";
            /*}else{
             js.src=url;
             js.async="true";
             js.type="text/javascript";
             }*/
            js.id = cssFontTitle;
            var fontSizeCss=''
            var styleEl=doc.createElement("style");
            styleEl.type = 'text/css';

            var getTitlesCss = function (fontSizesArr, fontWeightArr) {
                var titleCss = '';
                var currTitleNr = 1;
                for (var i = 0; i < fontSizesArr.length; i++) {
                    currTitleNr = (i + 1).toString();
                    titleCss += "h" + currTitleNr + ", .h" + currTitleNr + "-size{font-size:" + fontSizesArr[i] + "em;} h" + currTitleNr + ", .h" + currTitleNr + "-weight{" + toFontWeightCss(i + 1, fontWeightArr) + "} "
                }
                return titleCss;
            };

            if(cssElementSelector=="paragraph"){
                cssElementSelector = 'body,p,.paragraph-font,ul,ol,dl';
                if(fontSize) {
                    fontSizeCss+='@media only screen {';
                    fontSizeCss+=cssElementSelector+"{font-size:"+parseFloat(fontSize) * 0.93+"em;"+toFontWeightCss(1,fontWeightArr)+"}"
                    fontSizeCss += '}';
                    fontSizeCss += '@media only screen and (min-width: 768px) {';
                    fontSizeCss += cssElementSelector + "{font-size:" + parseFloat(fontSize) + "em;" + toFontWeightCss(1, fontWeightArr) + "}";
                    fontSizeCss += '}';
                }
            }else if(cssElementSelector=="title"){
                cssElementSelector = 'h1, h2, h3, h4, h5, h6,.title-font';
                if(fontSize) {
                    var fontSizesArr = [];
                    fontSizesArr.push( parseFloat(fontSize) );
                    fontSizesArr.push( fontSizesArr[0] * 0.85);
                    fontSizesArr.push(  (fontSizesArr[0] / 1.61).toFixed(2) );
                    fontSizesArr.push(  parseFloat(fontSizesArr[2]) * 0.8 );
                    fontSizesArr.push(  parseFloat(fontSizesArr[3]) * 0.8 );
                    fontSizeCss += '@media only screen {';
                    var mobileFSizes = fontSizesArr.map(function (fSize, i) {
                        if(i==4){
                            return parseFloat(fSize);
                        }else{
                            return parseFloat(fSize) * 0.85;
                        }
                    });
                    fontSizeCss+=getTitlesCss(mobileFSizes, fontWeightArr);
                    fontSizeCss += '}';
                    fontSizeCss += '@media only screen and (min-width: 768px) {';
                    fontSizeCss += getTitlesCss(fontSizesArr, fontWeightArr);
                    fontSizeCss += '}';
                }
            }


            if(!cssProps)cssProps = '';
            var css = cssElementSelector + '{font-family: "' + cssFontTitle + '",sans;' + cssProps + '}' + fontSizeCss;
            if (styleEl.styleSheet){
                styleEl.styleSheet.cssText = css;
            } else {
                styleEl.appendChild(document.createTextNode(css));
            }
            if(fjs==doc.head){
                doc.head.appendChild(js);
                doc.head.appendChild(styleEl);
            }else{
                fjs.parentNode.insertBefore(js, fjs);
                fjs.parentNode.insertBefore(styleEl, fjs);
            }
        };
    var self=this
    this.load= function(cssElementSelector,fontsUrl,fontCssName,cssProps, maxFontSize){
        setTimeout(function () {
            self.add( cssElementSelector,fontsUrl, fontCssName, cssProps, maxFontSize);
        }, 0);
        return self;
    }
    this.initMeta=function(){
        this.load('title').load("paragraph");
    }
    return self;

}(document ));