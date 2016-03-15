/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./InstanceManager','sap/ui/core/Popup'],function(q,I,P){"use strict";var M={};var O="0 -64",C="sapMMessageToast",E="sapUiSelectable";M._mSettings={duration:3000,width:"15em",my:"center bottom",at:"center bottom",of:document.defaultView,offset:"0 0",collision:"fit fit",onClose:null,animationTimingFunction:"ease",animationDuration:1000,autoClose:true,closeOnBrowserNavigation:true};M._aPopups=[];M._iOpenedPopups=0;M._bBoundedEvents=false;M._validateSettings=function(s){this._isFiniteInteger(s.duration);this._validateWidth(s.width);this._validateDockPosition(s.my);this._validateDockPosition(s.at);this._validateOf(s.of);this._validateOffset(s.offset);this._validateCollision(s.collision);this._validateOnClose(s.onClose);this._validateAutoClose(s.autoClose);this._validateAnimationTimingFunction(s.animationTimingFunction);this._isFiniteInteger(s.animationDuration);};M._isFiniteInteger=function(N){if(typeof N!=="number"||!isFinite(N)||!(Math.floor(N)===N)||N<=0){q.sap.log.error('"iNumber" needs to be a finite positive nonzero integer on '+this+"._isFiniteInteger");}};M._validateWidth=function(w){if(!sap.ui.core.CSSSize.isValid(w)){q.sap.log.error(w+' is not of type '+'"sap.ui.core.CSSSize" for property "width" on '+this+"._validateWidth");}};M._validateDockPosition=function(d){if(!sap.ui.core.Dock.isValid(d)){q.sap.log.error('"'+d+'"'+' is not of type '+'"sap.ui.core.Popup.Dock" on '+this+"._validateDockPosition");}};M._validateOf=function(e){if(!(e instanceof q)&&!(e&&e.nodeType===1)&&!(e instanceof sap.ui.core.Control)&&e!==window){q.sap.log.error('"of" needs to be an instance of sap.ui.core.Control or an Element or a jQuery object or the window on '+this+"._validateOf");}};M._validateOffset=function(o){if(typeof o!=="string"){q.sap.log.error(o+' is of type '+typeof o+', expected "string" for property "offset" on '+this+"._validateOffset");}};M._validateCollision=function(s){var r=/^(fit|flip|none|flipfit|flipflip|flip flip|flip fit|fitflip|fitfit|fit fit|fit flip)$/i;if(!r.test(s)){q.sap.log.error('"collision" needs to be a single value “fit”, “flip”, or “none”, or a pair for horizontal and vertical e.g. "fit flip”, "fit none", "flipfit" on '+this+"._validateOffset");}};M._validateOnClose=function(f){if(typeof f!=="function"&&f!==null){q.sap.log.error('"onClose" should be a function or null on '+this+"._validateOnClose");}};M._validateAutoClose=function(b){if(typeof b!=="boolean"){q.sap.log.error('"autoClose" should be a boolean on '+this+"._validateAutoClose");}};M._validateAnimationTimingFunction=function(t){var r=/^(ease|linear|ease-in|ease-out|ease-in-out)$/i;if(!r.test(t)){q.sap.log.error('"animationTimingFunction" should be a string, expected values: '+"ease, linear, ease-in, ease-out, ease-in-out on "+this+"._validateAnimationTimingFunction");}};function h(o){for(var p=["my","at","of","offset"],i=0;i<p.length;i++){if(o[p[i]]!==undefined){return false;}}return true;}function c(s){var m=document.createElement("div");m.style.width=s.width;m.className=C+" "+E;m.setAttribute("role","alert");m.appendChild(document.createTextNode(s.message));return m;}function n(o){if(o){if(h(o)){o.offset=O;}if(o.of&&o.of.nodeType===9){o.of=document.defaultView;}}else{o={offset:O};}return o;}M._handleResizeEvent=function(){if(sap.ui.Device.system.phone||sap.ui.Device.system.tablet){this._resetPosition(this._aPopups);}q.sap.delayedCall(0,this,"_applyPositions",[this._aPopups]);};M._handleMouseDownEvent=function(e){var i=e.target.hasAttribute("class")&&e.target.getAttribute("class").indexOf(C)!==-1;if(i||e.isMarked("delayedMouseEvent")){return;}this._aPopups.forEach(function(p){p&&p.__bAutoClose&&p.close();});};M._resetPosition=function(p){for(var i=0,m;i<p.length;i++){m=p[i]&&p[i].getContent();if(m){m.style.visibility="hidden";m.style.left=0;}}};M._applyPositions=function(p){for(var i=0,o,m;i<p.length;i++){o=p[i];if(o){m=o._oPosition;if(sap.ui.Device.system.phone||sap.ui.Device.system.tablet){q.sap.delayedCall(0,this,"_applyPosition",[o,m]);}else{o.setPosition(m.my,m.at,m.of,m.offset);}}}};M._applyPosition=function(p,m){var m=m||p._oPosition,o=p.getContent();p.setPosition(m.my,m.at,m.of,m.offset);o.style.visibility="visible";};M._setCloseAnimation=function(m,d,f,s){var a="opacity "+s.animationTimingFunction+" "+s.animationDuration+"ms",t="webkitTransitionEnd."+C+" transitionend."+C;if(!sap.ui.getCore().getConfiguration().getAnimation()){a="0ms";}if(s.animationDuration>0){m[0].style.webkitTransition=a;m[0].style.transition=a;m[0].style.opacity=0;m.on(t,function handleMTTransitionEnd(){m.off(t);f();});}else{f();}};M.show=function(m,o){var t=this,s=q.extend({},this._mSettings,{message:m}),p=new P(),i,a,b="mousedown."+C+" touchstart."+C,d;o=n(o);q.extend(s,o);this._validateSettings(s);a=c(s);i=this._aPopups.push(p)-1;p.setContent(a);p.setPosition(s.my,s.at,s.of,s.offset,s.collision);if(q.support.cssTransitions){p.setAnimations(function fnMessageToastOpen($,D,g){g();},function fnMessageToastClose($,D,g){t._setCloseAnimation($,D,g,s);});}p.setShadow(false);p.__bAutoClose=s.autoClose;if(s.closeOnBrowserNavigation){I.addPopoverInstance(p);}if(!this._bBoundedEvents){q(window).on("resize."+C,this._handleResizeEvent.bind(this));q(document).on(b,this._handleMouseDownEvent.bind(this));this._bBoundedEvents=true;}p.open();this._iOpenedPopups++;function e(){I.removePopoverInstance(t._aPopups[i]);q(t._aPopups[i].getContent()).remove();t._aPopups[i].detachClosed(e);t._aPopups[i].destroy();t._aPopups[i]=null;t._iOpenedPopups--;if(t._iOpenedPopups===0){t._aPopups=[];q(window).off("resize."+C);q(document).off(b);t._bBoundedEvents=false;}if(typeof s.onClose==="function"){s.onClose.call(t);}}p.attachClosed(e);d=q.sap.delayedCall(s.duration,p,"close");function f(){q.sap.clearDelayedCall(d);d=null;}p.getContent().addEventListener("touchstart",f);p.getContent().addEventListener("mouseover",f);if(sap.ui.Device.system.desktop){p.getContent().addEventListener("mouseleave",function(){d=q.sap.delayedCall(s.duration,p,"close");});}};M.toString=function(){return"sap.m.MessageToast";};return M;},true);
