/**
 * jquery.barkconsole.js v1.2
 * jQuery Bark Javascript Development Console
 * @author barkconsole.com
 * Copyright (c) barkconsole.com
 */
var outConsoleBkj32a82Params = {
    lineNumber : 0, // the line number in the console that is started from 
    index : {},
    paused : false,
    stopped : false,
    bufferSize : 1000,
    pauseBuffer : [],
    defaultCellWidth : "50%",
    zIndex : 2147484000,
    dev : true // makes bark do nothing if false
};
$(window).bind("keypress.outConsoleBkj32a82Shortcuts", function (e) {
    if (e.ctrlKey && e.shiftKey && e.key == "C")
        bark(undefined, undefined, "toggle");
});
function bark(mixed1, mixed2, params) {
	//alert("undefined" == undefined);
    if (mixed1 == undefined && mixed2 == undefined) {
        return bark("undefined");
    }
    var
    strIdentity = "outConsoleBkj32a82",
    qself = $("#"+strIdentity);
    if (params == "toggle") {
        if (qself.length) {
            qself.remove();
        } else {
            bark();
        }
        return;
    }
    if (typeof params != "undefined")
        outConsoleBkj32a82Params = $.extend(outConsoleBkj32a82Params, params);
    params = outConsoleBkj32a82Params;
    if (!params.dev || params.stopped)
        return;
    if (params.paused)
        return params.pauseBuffer.push([mixed1,mixed2]);
    var 
    intResizeMargins = 5,
    intDefaultRightWidthPercentage = 70,
    intDefaultHeightPixels = 200;
    // insert the value
    //console.log("qself.length: " + qself.length);
    if (qself.length) {
        if (typeof mixed1 != "undefined") {
            if (typeof mixed2 == "undefined") {
                params.lineNumber++;
                // left
                var qrow = $("<div class='" + strIdentity + "Row'></div>")
                .css({
                    backgroundColor:'#f7f7f7',
                    cursor:'pointer',
                    borderBottom:'1px solid #999',
                    padding:4,
                    marginBottom:1,
                    maxHeight:20,
                    overflow:'hidden',
                    whiteSpace:'nowrap',
                    textOverflow:'ellipsis'
                })
                .text(params.lineNumber+": "+dumper(mixed1));
                $(params.index['leftPanel']).prepend(qrow);
                var arrChildren = $(params.index['leftPanel']).children();
                if (arrChildren.length > params.bufferSize) {
                    $(arrChildren[arrChildren.length-1]).remove();
                }
            } else {
                // right
                var 
                strKeyName = strIdentity + "Cell" + encodeURIComponent(mixed1).replace(/[^a-z0-9_]/gi, "_"),
                qcell = $("#" + strKeyName),
                qkey,
                qvalue;
                if (!qcell.length) {
                    // init cell
                    qcell = $("<div class='" + strIdentity + "Cell' id='" + strKeyName + "'></div>")
                    .css({
                        display:'inline-block',
                        width:params.defaultCellWidth,
                        cursor:'pointer',
                        padding:1,
                        margin:0,
                        boxSizing:'border-box',
                        backgroundColor:'#666'
                    });
                    $(params.index['rightPanel']).prepend(qcell);
                    qkey = $("<div></div>")
                    .css({
                        display:'inline-block',
                        maxWidth:100,
                        lineHeight:'30px',
                        padding:'0 10px 0 5px',
                        color:'#fff',
                        boxSizing:"border-box",
                        overflow:'hidden',
                        whiteSpace:'nowrap',
                        textOverflow:'ellipsis'
                    }).html(mixed1);
                    qcell.append(qkey);
                    qvalue = $("<div></div>")
                    .css({
                        display:'inline-block',
                        boxSizing:"border-box",
                        lineHeight:'30px',
                        padding:'0 4px',
                        color:'#fff',
                        backgroundColor:'#888',
                        overflow:'hidden',
                        whiteSpace:'nowrap',
                        textOverflow:'ellipsis'
                    });
                    qcell.append(qvalue);
                    fnFixDims();
                    var arrChildren = $(params.index['rightPanel']).children();
                    if (arrChildren.length > params.bufferSize) {
                        $(arrChildren[arrChildren.length-1]).remove();
                    }
                } else {
                    //qkey = qcell.find("td:first-child");
                    qvalue = qcell.find("div:last-child");
                }
                qvalue.text(dumper(mixed2));
            }
        }
    }
    else
    {
        // Init Bark!
        var 
        objEvents = {
            centerResize : {
                mousedown : function () {
                    var qthis = $(this);
                    $(window).bind("mousemove."+strIdentity, function (e) {
                        var intPercent = Math.min(100-intResizeMargins, Math.max(intResizeMargins, e.clientX / $(window).width() * 100));
                        setCenter(intPercent);
                        document.cookie = strIdentity+"CenterPosition=" + intPercent + ";";
                        fnFixDims();
                    });
                    $(window).bind("mouseup."+strIdentity, function () {
                        $(window).unbind("mouseup."+strIdentity);
                        $(window).unbind("mousemove."+strIdentity);
                    });
                }
            },
            topResize : {
                mousedown : function () {
                    var qthis = $(this);
                    $(window).bind("mousemove."+strIdentity, function (e) {
                        var 
                        intWindow = $(window).innerHeight(),
                        intPercent = Math.min(intWindow-intResizeMargins, Math.max(intResizeMargins, intWindow-e.clientY));
                        setTop(intPercent);
                        document.cookie = strIdentity+"TopPosition=" + intPercent + ";";
                    });
                    $(window).bind("mouseup."+strIdentity, function () {
                        $(window).unbind("mouseup."+strIdentity);
                        $(window).unbind("mousemove."+strIdentity);
                    });
                }
            },
            leftPanel : {
                click : function (e) {
                    qtarget = $(e.target);
                    if (qtarget.hasClass("outConsoleBkj32a82Row")) {
                        function close(qthis) {
                            qthis.remove();
                            $(document).unbind("keyup.close"+strIdentity);
                        }
                        var strText = qtarget.text().replace(/^[0-9]+: /, ""),
                        qcontent = $("<div style='z-index:" + (params.zIndex+2) + ";position:fixed;background-color:rgba(0,0,0,0.5);width:100%;height:100%;top:0;left:0;padding:60px;box-sizing:border-box;'></div>");
                        qcontent.click(function (e) {
                            if ($(e.target).is("textarea"))
                                return;
                            close(qcontent);
                        });
                        qbody = $("<textarea style='white-space: pre;overflow-wrap: normal;overflow-x: scroll;background-color:#fff;width:100%;height:100%;padding:10px;box-sizing:border-box;overflow:scroll;'></textarea>");
                        qbody.val(strText);
                        qcontent.append(qbody); 
                        $("#outConsoleBkj32a82").append(qcontent);
                        qbody.focus()[0].setSelectionRange(0,0);
                        $(document).bind("keyup.close"+strIdentity, function(e){
                            if(e.keyCode === 27)
                                close(qcontent);
                        });
                    }
                }
            },
            rightPanel : {
                click : function (e) {
                    var
                    qtarget = $(e.target),
                    qcell = qtarget.parent(".outConsoleBkj32a82Cell");
                    if (qcell.length) {
                        function close(qthis) {
                            qthis.remove();
                            $(document).unbind("keyup.close"+strIdentity);
                        }
                        var strText = qtarget.text().replace(/^[0-9]+: /, "");
                        var
                        qcontent = $("<div style='z-index:" + (params.zIndex+2) + ";position:fixed;background-color:rgba(0,0,0,0.5);width:100%;height:100%;top:0;left:0;padding:60px;box-sizing:border-box;'></div>");
                        qcontent.click(function (e) {
                            if ($(e.target).is("textarea"))
                                return;
                            close(qcontent);
                        });
                        qbody = $("<textarea style='white-space: pre;overflow-wrap: normal;overflow-x: scroll;background-color:#fff;width:100%;height:100%;padding:10px;box-sizing:border-box;'></textarea>");
                        qbody.val(strText);
                        qcontent.append(qbody); 
                        $("#outConsoleBkj32a82").append(qcontent);
                        qbody.focus()[0].setSelectionRange(0,0);
                        $(document).bind("keyup.close"+strIdentity, function(e){
                            if(e.keyCode === 27)
                                close(qcontent);
                        });
                    }
                }
            },
            minimize : {
                click : function () {
                    var intTop = intResizeMargins+55;
                    if (getCookie(strIdentity+"TopPosition") == intTop)
                        intTop = intResizeMargins;
                    setTop(intTop);
                    document.cookie = strIdentity+"TopPosition=" + intTop + ";";
                }
            },
            maximize : {
                click : function () {
                    var intTop = $(window).height()-intResizeMargins;
                    if (getCookie(strIdentity+"TopPosition") == intTop)
                        intTop = $(window).height();
                    setTop(intTop);
                    document.cookie = strIdentity+"TopPosition=" + intTop + ";";
                }
            },
            normalize : {
                click : function () {
                    var intTop = intDefaultHeightPixels;
                    if (getCookie(strIdentity+"TopPosition") == intTop)
                        intTop = intTop+110;
                    setTop(intTop);
                    document.cookie = strIdentity+"TopPosition=" + intTop + ";";
                }
            },
            play : {
                click : function () {
                    params.stopped = false;
                    params.paused = false;
                    while (params.pauseBuffer.length) {
                        var arrItem = params.pauseBuffer.shift();
                        bark(arrItem[0], arrItem[1]);
                    }
                }
            },
            pause : {
                click : function () {
                    params.stopped = false;
                    params.paused = true;
                }
            },
            stop : {
                click : function () {
                    params.stopped = true;
                    params.paused = false;
                }
            },
            target : {
                click : function () {
                    qthis = $(this);
                    if (qthis.hasClass(strIdentity+'Down')) {
                        qthis.removeClass(strIdentity+'Down');
                        $(window).unbind("mouseover." + strIdentity + "Target");
                        $(window).unbind("mousedown." + strIdentity + "Target");
                    } else {
                        qthis.addClass(strIdentity+'Down');
                        $(window).bind("mouseover." + strIdentity + "Target", function (e) {
                            bark(e.target);
                        });
                        $(window).bind("mousedown." + strIdentity + "Target", function () {
                            qthis.trigger("click");
                        });
                    }
                }
            },
            input : {
                click : function () {
                    function close(qthis) {
                        qthis.remove();
                        $(document).unbind("keyup.close"+strIdentity);
                    }
                    qcontent = $("<form><div style='z-index:" + (params.zIndex+2) + ";position:fixed;background-color:rgba(0,0,0,0.5);width:100%;height:100%;top:0;left:0;padding:60px;box-sizing:border-box;'></div></form>");
                    qinner = qcontent.find("div:first-child");
                    qinner.click(function (e) {
                        if ($(e.target).is("textarea,input"))
                            return;
                        close(qcontent);
                    });
                    qbody = $("<textarea placeholder='Enter Javascript' style='background-color:#fff;width:100%;height:100%;padding:10px;box-sizing:border-box;'></textarea>");
                    qsave = $("<input class='" + strIdentity + "FocusBorder' type='submit' style='position:absolute;width:60px;right:70px;bottom:70px;background-color:#4cb0ff;color:#fff;border:0;' value='Run'>");
                    qinner.append(qbody);
                    qinner.append(qsave);
                    qcontent.bind("submit", function (e) {
                        e.preventDefault();
                        var strCode = qbody.val();
                        if (strCode) {
                            try {
                                eval(strCode); 
                            } catch (e) {
                                if (e instanceof SyntaxError) {
                                    bark(e.message);
                                }
                            }
                        }
                    });
                    $("#outConsoleBkj32a82").append(qcontent);
                    qbody.focus();
                    $(document).bind("keyup.close"+strIdentity, function(e){
                        if(e.keyCode === 27)
                            close(qcontent);
                    });
                }
            },
            reset : {
                click : function () {
                    params.lineNumber = 0;
                    $(params.index["leftPanel"]).children().remove();
                    $(params.index["rightPanel"]).children().remove();
                }
            },
            close : {
                click : function () {
                    qself.remove();
                }
            }
        },
        getCookie = function (key) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + key + "=");
            if (parts.length == 2) 
                return parts.pop().split(";").shift();
        },
        setCenter = function (intPercent) {
            $(params.index["centerResize"]).css({
                left : intPercent + "%"
            });
            $(params.index["leftPanel"]).css({
                width : intPercent + "%"
            });
            $(params.index["rightPanel"]).css({
                width : (100-intPercent) + "%",
                left : intPercent + "%"
            });
        },
        setTop = function (intPixels, boolFinal) {
        	console.log(intPixels);
            qself.css({
                height : intPixels*1
            });
            console.log(qself.css("height"));
            if (!boolFinal)
                fnFixDims(true);
        };
        objSkin = {
            title : {
                width:"100%",
                textAlign:'center',
                boxSizing:"border-box"
            },
            titleLink : {
                height:30,
                position:'absolute',
                fontFamily:'Tahoma, Arial Black, Arial Bold, Gadget, sans-serif',
                lineHeight:'30px',
                display:'inline-block',
                textShadow:'2px 2px 0 #000',
                color:"#fff",
                fontWeight:'bold',
                fontSize:'15px',
                opacity:0.5,
                marginTop:-1,
                textDecoration:'none'
            },
            barkHelper1 : {
                display:'inline-block',
                width:11,
                marginTop:-3,
                marginLeft:1,
                height:11,
                verticalAlign:"middle",
                lineHeight:0,
                perspective: '1000px',
                transform: 'rotateY(30deg)'
            },
            barkHelper2 : {
                display:'inline-block',
                height:"14%",
                boxShadow:"2px 2px 0 #000",
                transform: 'rotate(-28deg)',
                width:'70%',
                backgroundColor:"#fff",
                verticalAlign:'top',
                marginBottom:3
            },
            barkHelper3 : {
                display:'inline-block',
                height:"14%",
                boxShadow:"2px 2px 0 #000",
                transform: 'rotate(0deg)',
                width:'70%',
                backgroundColor:"#fff",
                verticalAlign:'top',
                marginBottom:3
            },
            barkHelper4 : {
                display:'inline-block',
                height:"14%",
                boxShadow:"2px 2px 0 #000",
                transform: 'rotate(28deg)',
                width:'70%',
                backgroundColor:"#fff",
                verticalAlign:'top'
            },
            topResize : {
                position:'absolute',
                height:6,
                width:'100%',
                backgroundColor:'#4cb0ff',
                cursor:'row-resize',
                zIndex:1,
                border:'0 solid #fff',
                borderWidth:'1px 0',
                top:-7
            },
            centerResize : {
                position:'absolute',
                width:6,
                marginLeft:-2,
                left:intDefaultRightWidthPercentage+'%',
                height:'100%',
                backgroundColor:'#4cb0ff',
                cursor:'col-resize',
                zIndex:1,
                border:'0 solid #fff',
                borderWidth:'0 2px'
            },
            topControls : {
                position:'absolute',
                height:30,
                width:'100%',
                backgroundColor:'#555',
                borderBottom:'2px solid #fff',
                zIndex:2
            },
            mainBody : {
                position:'relative',
                width:'100%',
                height:'100%',
                paddingTop:30,
                boxSizing:'border-box'
            },
            leftPanel : {
                float:'left',
                width:intDefaultRightWidthPercentage+'%',
                height:'100%',
                backgroundColor:'#eee',
                overflowY:'auto'
            },
            rightPanel : {
                float:'right',
                right:0,
                width:(100-intDefaultRightWidthPercentage)+'%',
                height:'100%',
                backgroundColor:'#555',
                overflowY:'auto',
                padding:'6px 3px 6px 13px',
                boxSizing:'border-box',
                lineHeight:'13px'
            },
            stopHelper : {
                width:14,
                height:14,
                backgroundColor:'#fff'
            },
            resetHelper1 : {
                marginLeft:5.3,
                marginBottom:-1,
                borderRadius:'1px 1px 0 0',
                width: 4,
                height: 2,
                backgroundColor:'#fff',
                transform: 'rotate(5deg)'
            },
            resetHelper2 : {
                marginLeft:1,
                borderRadius:'7px 7px 2px 2px',
                width: 12,
                height: 2,
                backgroundColor:'#fff',
                marginBottom:1,
                transform: 'rotate(5deg)'
            },
            resetHelper3 : {
                marginLeft:2.5,
                borderRadius:'0 0 1.5px 1.5px',
                width: 9,
                height: 9,
                backgroundColor:'#fff'
            },
            inputHelper : {
                margin:2,
                width:10,
                height:10,
                borderRadius:5,
                backgroundColor:'#fff'
            },
            target : {
                position:'relative'
            },
            targetHelper1 : {
                margin:1,
                width:8,
                height:8,
                borderRadius:10,
                border:'2px solid #fff'
            },
            targetHelper2 : {
                position:'absolute',
                top:14.5,
                left:8,
                width:14,
                height:1,
                backgroundColor:'#fff'
            },
            targetHelper3 : {
                position:'absolute',
                left:14.5,
                top:8,
                width:1,
                height:14,
                backgroundColor:'#fff'
            },
            playHelper : {
                width: 0,
                height: 0,
                border: '0 solid transparent',
                borderWidth: '7px 0',
                borderLeft: '14px solid #fff'
            },
            pauseHelper : {
                width:6,
                height:14,
                backgroundColor:'#fff',
                float:'left'
            },
            pauseHelper2 : {
                width:6,
                height:14,
                backgroundColor:'#fff',
                float:'right'
            },
            minimize : {
                position:'relative',
                float:'right'
            },
            minimizeHelper : {
                backgroundColor:'#fff',
                marginTop:10,
                height:4
            },
            maximize : {
                verticalAlign:'top',
                float:'right',
                lineHeight:0
            },
            maximizeHelper1 : {
                verticalAlign:'top',
                display:'inline-block',
                backgroundColor:'#fff',
                height:11,
                width:3
            },
            maximizeHelper2 : {
                verticalAlign:'top',
                display:'inline-block',
                backgroundColor:'#fff',
                width:8,
                height:3
            },
            maximizeHelper3 : {
                verticalAlign:'top',
                display:'inline-block',
                backgroundColor:'#fff',
                width:3,
                height:11
            },
            maximizeHelper4 : {
                verticalAlign:'top',
                display:'inline-block',
                backgroundColor:'#fff',
                width:14,
                height:3
            },
            normalize : {
                verticalAlign:'top',
                float:'right',
                lineHeight:0,
                paddingTop:13
            },
            normalizeHelper1 : {
                verticalAlign:'top',
                display:'inline-block',
                backgroundColor:'#fff',
                height:6,
                width:3
            },
            normalizeHelper3 : {
                verticalAlign:'top',
                display:'inline-block',
                backgroundColor:'#fff',
                width:3,
                height:6
            },
            close : {
                position:'relative',
                float:'right'
            },
            closeHelper1 : {
                width:4,
                height:14,
                backgroundColor:'#fff',
                transform: 'rotate(45deg)',
                position:'absolute',
                left:14
            },
            closeHelper2 : {
                width:4,
                height:14,
                backgroundColor:'#fff',
                transform: 'rotate(-45deg)',
                position:'absolute',
                left:14
            },
            leftLine : {
                float:'left',
                paddingTop:6,
                width:12,
                height:18,
                display:'inline-block'
            },
            lineHelper : {
                width:5,
                borderRight:'2px solid #777',
                height:'100%'
            }
        };
        qself = $(
            "<div id='" + strIdentity + "'>"
                + "<div c='topResize'></div>"
                + "<div c='centerResize'></div>"
                + "<div c='topControls'>"
                    + "<div c='title'><a target='_blank' class='outConsoleBkj32a82titleLink' href='http://barkconsole.com' c='titleLink'>Bark<div c='barkHelper1'><div c='barkHelper2'></div><div c='barkHelper3'></div><div c='barkHelper4'></div></div></a></div>"
                    + "<style>.outConsoleBkj32a82Cell * {cursor:pointer;} .outConsoleBkj32a82titleLink:hover {opacity:1!important};</style>"
                    + "<style>.outConsoleBkj32a82FocusBorder {border:2px solid transparent !important;}.outConsoleBkj32a82FocusBorder:focus {border:2px solid #555 !important}</style>"
                    + "<style>.outConsoleBkj32a82Button {opacity:0.5;display:inline-block;float:left;cursor:pointer;height:30px;width:31px;padding:8px;box-sizing:border-box;} .outConsoleBkj32a82Button * {cursor:pointer;} .outConsoleBkj32a82Button:hover</style>"
                    + "<style>.outConsoleBkj32a82Button:hover,.outConsoleBkj32a82Down {opacity:1; background-color:rgba(255,255,255,0.2);};</style>"
                    + "<div c='reset' class='outConsoleBkj32a82Button'><div c='resetHelper1' class='outConsoleBkj32a82Helper'></div><div c='resetHelper2' class='outConsoleBkj32a82Helper'></div><div c='resetHelper3' class='outConsoleBkj32a82Helper'></div></div>"
                    + "<div c='leftLine'><div c='lineHelper'></div></div>"
                    + "<div c='play' class='outConsoleBkj32a82Button'><div c='playHelper' class='outConsoleBkj32a82Helper'></div></div>"
                    + "<div c='pause' class='outConsoleBkj32a82Button'><div c='pauseHelper' class='outConsoleBkj32a82Helper'></div><div c='pauseHelper2' class='outConsoleBkj32a82Helper'></div></div>"
                    + "<div c='stop' class='outConsoleBkj32a82Button'><div c='stopHelper' class='outConsoleBkj32a82Helper'></div></div>"
                    + "<div c='leftLine'><div c='lineHelper'></div></div>"
                    + "<div c='input' class='outConsoleBkj32a82Button'><div c='inputHelper' class='outConsoleBkj32a82Helper'></div></div>"
                    + "<div c='target' class='outConsoleBkj32a82Button'><div c='targetHelper1' class='outConsoleBkj32a82Helper'></div><div c='targetHelper2' class='outConsoleBkj32a82Helper'></div><div c='targetHelper3' class='outConsoleBkj32a82Helper'></div></div>"
                    + "<div c='close' class='outConsoleBkj32a82Button'><div class='outConsoleBkj32a82Helper'><div c='closeHelper1'></div><div c='closeHelper2'></div></div></div>"
                    + "<div c='maximize' class='outConsoleBkj32a82Button'><div c='maximizeHelper1' class='outConsoleBkj32a82Helper'></div><div c='maximizeHelper2' class='outConsoleBkj32a82Helper'></div><div c='maximizeHelper3' class='outConsoleBkj32a82Helper'></div><div c='maximizeHelper4' class='outConsoleBkj32a82Helper'></div></div>"
                    + "<div c='normalize' class='outConsoleBkj32a82Button'><div c='normalizeHelper1' class='outConsoleBkj32a82Helper'></div><div c='maximizeHelper2' class='outConsoleBkj32a82Helper'></div><div c='normalizeHelper3' class='outConsoleBkj32a82Helper'></div><div c='maximizeHelper4' class='outConsoleBkj32a82Helper'></div></div>"
                    + "<div c='minimize' class='outConsoleBkj32a82Button'><div c='minimizeHelper' class='outConsoleBkj32a82Helper'></div></div>"
                + "</div>"
                + "<div c='mainBody'>"
                    + "<div c='leftPanel'></div>"
                    + "<div c='rightPanel'></div>"
                + "</div>"
            + "</div>"
        )
        .disableSelect()
        .css({
            position:'fixed',
            bottom:0,
            left:0,
            width:'100%',
            height:intDefaultHeightPixels,
            zIndex:params.zIndex,
            userSelect: 'none',
            lineHeight:'23px',
            fontSize:'16px',
            font:'Helvetica,Verdana,sans-serif',
            color:'#000',
            letterSpacing:'0.2px',
            textAlign:'left',
            overflow:'visible',
            margin:0,
            padding:0,
            cursor:'default'
        });
        qself.find("*[c]").each(function () {
            var 
            qthis = $(this),
            strName = qthis.attr("c");
            params.index[strName] = this;
            if (objSkin[strName])
                qthis.css(objSkin[strName]);
            qthis.attr("id", strIdentity+'__'+strName);
            qthis.removeAttr("c");
            var objEventItems = objEvents[strName];
            for (var strEvent in objEventItems) {
                qthis.bind(strEvent, objEventItems[strEvent]);
            }
        });
        var intTop = getCookie(strIdentity+"TopPosition"),
        intLeft = getCookie(strIdentity+"CenterPosition");
        if (intTop)
            setTop(intTop);
        if (intLeft)
            setCenter(intLeft);
        $("body").prepend(qself);
        $(window).bind("resize", fnFixDims);
        return bark(mixed1, mixed2)
    }
    
    function fnFixDims () {
        var 
        qrightPanel = $(params.index['rightPanel']),
        qcells = qrightPanel.find(".outConsoleBkj32a82Cell");
        if (qrightPanel.width() <400)
            qcells.css({
                width:"100%"
            });
        else if (qrightPanel.width() <800)
            qcells.css({
                width:"50%"
            });
        else if (qrightPanel.width() <1100)
            qcells.css({
                width:"33%"
            });
        else 
            qcells.css({
                width:"25%"
            });
        qcells.each(function () {
            var 
            qcell = $(this),
            qkey = qcell.find("div:first-child"),
            qvalue = qcell.find("div:last-child");
            qvalue.css({
                width : (qcell.width()-qkey.width()-17)
            });
        });
        if (qself.height()>$(window).height()) {
            setTop($(window).height()-intResizeMargins, true);
        }
    }
    
    function dumper(object) {
        function recursion (obj, level, stop, strType) {
            //if (stop == 4)
            //  return '...';
            var strDel = "\t";
            if(!level) level = 0;
            var dump = '', p = '';
            for(i = 0; i < level; i++) p += strDel;
            t = strType || type(obj);
            if (obj == document)
                return 'HTMLDocument';
            switch(t) {
                 case "string":
                    return '"' + obj + '"';
                    break;
                 case "number":
                    return obj.toString();
                    break;
                 case "boolean":
                    return obj ? 'true' : 'false';
                 case "date":
                    return "Date: " + obj.toLocaleString();
                 case "array":
                    dump += 'Array[' + obj.length + '] ( \n';
                    $.each(obj, function(k,v) {
                       dump += p + strDel + k + ' => ' + recursion(v, level + 1, stop*2) + '\n';
                    });
                    dump += p + ')';
                    break;
                 case "object":
                    var 
                    arrKeys = Object.keys(obj),
                    intKeys = Object.keys(obj).length;
                    dump += 'Object [' + intKeys + '] { \n';
                    for (var itr=0;itr!=intKeys;itr++) {
                        var k = arrKeys[itr],
                        v = obj[k];
                        dump += p + strDel + k + ': ' + recursion(v, level + 1, stop*2) + '\n';
                    }
                    dump += p + '}';
                    break;
                 case "jquery":
                    dump += 'jQuery Object [' + Object.keys(obj).length + '] { \n';
                    $.each(obj, function(k,v) {
                       dump += p + strDel + k + ' = ' + recursion(v, level + 1, stop*2) + '\n';
                    });
                    dump += p + '}';
                    break;
                 case "regexp":
                    return "RegExp: " + obj.toString();
                 case "error":
                    return obj.toString();
                 case "document":
                 case "domelement":
                    
                    dump += 'DOMElement [ \n';
                    var arrSimpleItems = ['id','src','nodeName','type','className','name','value','checked','action','method','target'];
                    for (intKey in arrSimpleItems)
                    {
                        if (obj[arrSimpleItems[intKey]])
                            dump += p +  strDel + arrSimpleItems[intKey] + ': ' + obj[arrSimpleItems[intKey]] + '\n';
                    }
                    var strCSS = css(obj);
                    if (strCSS.length)
                        dump += p + strDel + 'style: ' + strCSS + '\n';
                    if (obj.childNodes.length)
                    {
                        dump += p + strDel + 'innerHTML [' + obj.childNodes.length + ']: [ \n';
                        var offset = 0;
                        for (i3 in obj.childNodes)
                        {
                            if (isNaN(i3))
                                continue;
                            var v = obj.childNodes[i3];
                            if(type(v) == "string") {
                                if(v.textContent.match(/[^\s]/))
                                    dump += p + strDel + strDel + (i3-offset) + ' = String: ' + trim(v.textContent) + '\n';
                                //else
                                    //offset++;
                            } else {
                                dump += p + strDel + strDel + (i3-offset) + ' = ' + recursion(v, level + 2, stop*2) + '\n';
                            }
                        }
                        dump += p + strDel + ']\n';
                    }
                    dump += p + ']';
                    break;
                 case "function":
                    if (stop > 0)
                        return p + trim(ellipsis(obj.toString(), 80).replace(/\t|\r?\n|\r/g, ''));
                    else 
                        dump += p + trim(obj.toString());
                    break;
                 case "window":
                    dump += 'window [ \n';
                    var obj2 = obj;
                    do {
                        Object.getOwnPropertyNames(obj2).forEach(function(name) {
                            if (name == 'undefined') {}
                            else if (!isNaN(parseInt (name)))
                                dump += p + strDel + name + ': Window\n';
                            else if (type(obj[name]) == "window")
                                dump += p + strDel + name + ': Window\n';
                            else
                                dump += p + strDel + name + ': ' + recursion(obj[name], level + 1, 1) + '\n';
                        });
                    } while(obj2 = Object.getPrototypeOf(obj2));
                    dump += p + ']';
                    break;
                 default:
                    dump += 'N/A';
                    break;
            }
            return dump;
        }
    
       function type (obj) {
          var type = typeof obj;
          if(type != "object") {
             return type;
          }
            
          switch(obj) {
             case null:
                return 'null';
             case window:
                return 'window';
             case document:
                return 'document';
             case window.event:
                return 'event';
             default:
                break;
          }
    
          if(obj.jquery) {
             return 'jquery';
          }
    
          switch(obj.constructor) {
             case Array:
                return 'array';
             case Boolean:
                return 'boolean';
             case Date:
                return 'date';
             case Object:
                return 'object';
             case RegExp:
                return 'regexp';
             case ReferenceError:
             case Error:
                return 'error';
             default:
                break;
          }
          switch(obj.nodeType) {
             case 1:
                return 'domelement';
             case 3:
                return 'string';
             default:
                break;
          }
          return 'object';
       }
       
       function css(element){
            var out = "";
            var elementStyle = element.style;
            var computedStyle = window.getComputedStyle(element, null);
            
            for (prop in elementStyle) {
                if (elementStyle.hasOwnProperty(prop)) {
                    var k = elementStyle[prop],
                    v = getStyle(element, elementStyle[prop]);
                    if (k.length && v.length) // remove any garbage
                        out += k + " : " + v + ";";
              }
            }
            return out;
        }
        function getStyle(el, styleProp) {
          var value, defaultView = (el.ownerDocument || document).defaultView;
          // W3C standard way:
          if (defaultView && defaultView.getComputedStyle) {
            // sanitize property name to css notation
            // (hypen separated words eg. font-Size)
            styleProp = styleProp.replace(/([A-Z])/g, "-q1").toLowerCase();
            return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
          } else if (el.currentStyle) { // IE
            // sanitize property name to camelCase
            styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
              return letter.toUpperCase();
            });
            value = el.currentStyle[styleProp];
            // convert other units to pixels on IE
            if (/^\d+(em|pt|%|ex)?q/i.test(value)) { 
              return (function(value) {
                var oldLeft = el.style.left, oldRsLeft = el.runtimeStyle.left;
                el.runtimeStyle.left = el.currentStyle.left;
                el.style.left = value || 0;
                value = el.style.pixelLeft + "px";
                el.style.left = oldLeft;
                el.runtimeStyle.left = oldRsLeft;
                return value;
              })(value);
            }
            return value;
          }
        }
        
        function trim(str) {
           return ltrim(rtrim(str));
        }
        function ltrim(str) {
           return str.replace(new RegExp("^[\\s]+", "g"), "");
        }
        function rtrim(str) {
           return str.replace(new RegExp("[\\s]+q", "g"), "");
        }
        function ellipsis(str, n) {
            return (str.length > n) ? str.substr(0, n-1) + '...' : str;
        }

    
       return recursion(object);
    }
}
