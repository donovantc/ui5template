/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/ManagedObject','sap/ui/core/IconPool','sap/m/Popover','sap/m/Text','sap/ui/layout/form/SimpleForm','sap/m/Label','sap/m/Link','sap/ui/core/HTML','sap/ui/core/Title'],function(q,M,I,P,T,S,L,a,H,b){'use strict';var c=M.extend("sap.ui.core.support.controls.InteractionTree",{constructor:function(){this.start=0;this.end=1;}});c.expandIcon='sap-icon://navigation-right-arrow';c.collapseIcon='sap-icon://navigation-down-arrow';c.headerIcon='<img class="sapUiInteractionSvgImage" src="HeaderIcon.svg">';c.prototype.setInteractions=function(i){this.interactions=i;this.start=0;this.end=1;this.updateRanges();};c.prototype.setRange=function(s,e){this.start=s;this.end=e;this.updateRanges();this.update();};c.prototype.updateRanges=function(){var i=this.interactions;if(!i||!i.length){return;}this.startTime=i[0].start;this.endTime=i[i.length-1].end;var r=this.endTime-this.startTime;this.actualStartTime=this.startTime+this.start*r;this.actualEndTime=this.startTime+this.end*r;this.timeRange=this.actualEndTime-this.actualStartTime;};c.prototype.update=function(){if(!this.parent){return;}q(this.parent).find('#'+this.getId()).remove();this.renderAt(this.parent);};c.prototype.renderAt=function(p){this.parent=p;var r=sap.ui.getCore().createRenderManager();this.render(r);r.flush(p);r.destroy();this.attachEvents();this.attachInteractionDetailsPopover();this.attachRequestDetailsPopover();};c.prototype.render=function(r){r.write('<div id="'+this.getId()+'" class="sapUiInteractionTreeContainer sapUiSizeCompact">');r.write('<div class="sapUiInteractionGridLinesContainer"></div>');r.write('<ul');r.addClass("sapUiInteractionTree");r.writeClasses();r.write(">");this.renderHeaders(r);var d,e=this.interactions;if(!e||!e.length){return;}for(var i=0;i<e.length;i++){d=e[i];this.renderInteraction(r,d,i);}r.write("</ul>");r.write("</div>");};c.prototype.attachEvents=function(){var t=this,i=q('.sapUiInteractionTreeContainer .sapUiInteractionTree');this.gridContainer=q('.sapUiInteractionTreeContainer .sapUiInteractionGridLinesContainer');this.gridContainerWidth=0;i.bind('click',function(e){var $=q(e.target);if($.hasClass('sapUiInteractionLeft')){t.handleInteractionClick($);}});this.gridContainer.resize(function(e){t.updateGridLines();});q(window).resize(function(e){t.updateGridLines();});t.updateGridLines();};c.prototype.updateGridLines=function(){var g=this.gridContainer,r=this.timeRange,w=this.gridContainer.width();if(this.gridContainerWidth==w){return;}g.empty();g.append('<div style="left:'+(this.getPosition(w,r,0)+6)+'px" class="sapUiInteractionGridLineIntervalText">'+this.formatGridLineDuration(0)+'</div>');var d=this.calculateInterval(w,r);for(var i=d;i<r;i+=d){var p=this.getPosition(w,r,i);if(i+d<r){g.append('<div style="left:'+(p+6)+'px" class="sapUiInteractionGridLineIntervalText">'+this.formatGridLineDuration(i)+'</div>');}g.append('<div style="left:'+p+'px" class="sapUiInteractionGridLine"></div>');}this.gridContainerWidth=w;};c.prototype.calculateInterval=function(w,r){var m=4;var d=Math.max(w*m/200.0,1.0);var e=r/d;var f=Math.pow(10,Math.floor(Math.log(e)/Math.LN10));var g=[10,5,2,1];for(var i=0;i<g.length;i++){var h=g[i];var j=f*h;if(d<(r/j)){break;}e=j;}return e;};c.prototype.getPosition=function(w,r,v){var p=w/r*v;return p;};c.prototype.handleInteractionClick=function($){var d=$.find('.sapUiInteractionTreeIcon');if(!d.length){return;}var e=d.attr('expanded')=='true';var f=d.parent();d.remove();var i=this.getIconHTML(!e);f.children().eq(0).after(i);var g=f.parent().parent();g.toggleClass('sapUiInteractionItemExpanded');var h=parseInt(g.attr('data-interaction-index'),10);this.interactions[h].isExpanded=!e;var j=g.find('ul');var k=e?'slideUp':'slideDown';j.stop(true,true)[k]('fast',function(){j.toggleClass('sapUiHiddenUiInteractionItems');});};c.prototype.renderHeaders=function(r){r.write('<li>');r.write('<div');r.addClass("sapUiInteractionTreeItem");r.addClass("sapUiInteractionItemDiv");r.addClass("sapUiInteractionHeader");r.writeClasses();r.write(">");r.write('<div class="sapUiInteractionTreeItemLeft">');r.write("<div>");r.write('<span class="sapUiInteractionItemComponentText">');r.writeEscaped('Component');r.write('</span>');r.write("<br/>");r.write('<span class="sapUiInteractionItemTriggerText">');r.writeEscaped('Trigger');r.write('</span>');r.write("</div>");r.write('</div>');r.write('<div class="sapUiInteractionTreeItemRight">');r.write('</div>');r.write("</div>");r.write("</li>");};c.prototype.isInteractionVisible=function(i){var s=i.start;var e=i.end;if(this.actualStartTime>e||this.actualEndTime<s){return false;}if(this.actualStartTime<s+i.duration&&this.actualEndTime>s){return true;}return this.hasVisibleRequests(i);};c.prototype.hasVisibleRequests=function(d){var r,s,e,f=d.requests;for(var i=0;i<f.length;i++){r=f[i];s=r.fetchStartOffset+r.startTime;e=r.fetchStartOffset+r.startTime+this.getRequestDuration(r);if(this.actualStartTime<e&&this.actualEndTime>s){return true;}}return false;};c.prototype.renderInteraction=function(r,d,e){var f,g=d.requests;if(!this.isInteractionVisible(d)){return;}r.write('<li data-interaction-index="'+e+'"');if(d.isExpanded){r.addClass('sapUiInteractionItemExpanded');r.writeClasses();}r.write('>');this.renderInteractionDiv(r,d);r.write("<ul");r.addClass("sapUiInteractionItem");if(!d.isExpanded){r.addClass("sapUiHiddenUiInteractionItems");}r.writeClasses();r.write(">");for(var i=0;i<g.length;i++){f=g[i];this.renderRequest(r,d,f,i);}r.write("</ul>");r.write("</li>");};c.prototype.renderInteractionDiv=function(r,i){r.write('<div');r.addClass("sapUiInteractionTreeItem");r.addClass("sapUiInteractionItemDiv");r.writeClasses();r.write(">");r.write('<div class="sapUiInteractionLeft sapUiInteractionTreeItemLeft">');r.write("<div>");r.write('<span class="sapUiInteractionItemComponentText">');r.writeEscaped((i.component!=="undetermined")?i.component:'Initial Loading');r.write('</span>');r.write("<br/>");r.write('<span class="sapUiInteractionItemTriggerText">');r.writeEscaped(i.trigger+" / "+i.event);r.write('</span>');r.write("</div>");if(i.requests.length){this.renderIcon(r,i.isExpanded);}if(i.sapStatistics.length&&i.requests.length){r.write('<div class="sapUiInteractionHeaderIcon">'+c.headerIcon+'</div>');}r.write('</div>');r.write('<div class="sapUiInteractionTreeItemRight">');var m=Math.round(i.start+i.duration);this.renderInteractionPart(r,i.start,m,'sapUiInteractionBlue');r.write('</div>');r.write("</div>");};c.prototype.renderInteractionPart=function(r,s,e,d){if(this.actualStartTime>e||this.actualEndTime<s){return;}e=Math.min(e,this.actualEndTime);s=Math.max(s,this.actualStartTime);var l=100/this.timeRange*(s-this.actualStartTime);var f=100/this.timeRange*(e-this.actualStartTime);var w=f-l;r.write('<span style="margin-left: '+l+'%; width: '+w+'%" class="sapUiInteractionTimeframe sapUiInteractionTimeInteractionFrame '+d+'"></span>');};c.prototype.renderRequest=function(r,i,d,e){var f=d.fetchStartOffset;var s=f+d.startTime;var g=f+d.startTime+this.getRequestDuration(d);if(this.actualStartTime>g||this.actualEndTime<s){return;}r.write('<li data-request-index="'+e+'"');r.addClass("sapUiInteractionTreeItem");r.addClass("sapUiInteractionRequest");r.writeClasses();r.write(">");r.write('<div class="sapUiInteractionTreeItemLeft sapUiInteractionRequestLeft">');var h=d.initiatorType||d.entryType;var j=this.getRequestColorClass(h);r.write('<span class="sapUiInteractionRequestIcon '+j+'"></span>');r.write('<span class="sapUiInteractionItemEntryTypeText">');r.writeEscaped(h);r.write('</span>');if(this.getRequestSapStatistics(i,d)){r.write('<div class="sapUiInteractionRequestHeaderIcon">'+c.headerIcon+'</div>');}r.write('</div>');r.write('<div class="sapUiInteractionTreeItemRight"');r.write('>');var k=this.getRequestRequestStart(d)+f;var l=this.getRequestResponseStart(d)+f;this.renderRequestPart(r,s,k,j+'70');this.renderRequestPart(r,k,l,j);this.renderRequestPart(r,l,g,j+'70');r.write('</div>');r.write("</li>");};c.prototype.getRequestSapStatistics=function(i,r){var s,d=i.sapStatistics;for(var j=0;j<d.length;j++){if(d[j].timing&&r.startTime===d[j].timing.startTime){s=d[j];return s;}}return false;};c.prototype.getRequestColorClass=function(r){var d;switch(r){case'xmlhttprequest':d='sapUiPurple';break;case'OData':d='sapUiRed';break;case'link':case'css':d='sapUiAccent1';break;default:d='sapUiAccent8';break;}return d;};c.prototype.attachRequestDetailsPopover=function(){var s,d,p,e,f,g,n,h,j,k,l,t,m,o,r,u,v;var w=this;var x=q('.sapUiInteractionRequest.sapUiInteractionTreeItem .sapUiInteractionTreeItemRight');if(x.length){var y=C();for(var i=0;i<x.length;i++){x[i].addEventListener('click',function(E){B.call(this);A.call(this);z.call(this);var F=q(this).children()[0];y.openBy(F);});}}function z(){var $=q(this);var E=$.parents('li[data-request-index]');var F=$.parents('li[data-interaction-index]');var G=parseInt(F.attr('data-interaction-index'),10);var J=parseInt(E.attr('data-request-index'),10);var K=w.interactions[G];var N=K.requests[J];if(!K||!N){return;}var O=w.getRequestSapStatistics(K,N);if(O){if(!l.getParent()){s.addContent(l);s.addContent(t);s.addContent(m);s.addContent(o);s.addContent(r);s.addContent(u);s.addContent(v);}var Q=O.statistics;m.setText(w.formatDuration(parseFloat(Q.substring(Q.indexOf("total=")+"total=".length,Q.indexOf(",")))));Q=Q.substring(Q.indexOf(",")+1);r.setText(w.formatDuration(parseFloat(Q.substring(Q.indexOf("fw=")+"fw=".length,Q.indexOf(",")))));Q=Q.substring(Q.indexOf(",")+1);v.setText(w.formatDuration(parseFloat(Q.substring(Q.indexOf("app=")+"app=".length,Q.indexOf(",")))));}else if(l.getParent()){s.removeContent(l);s.removeContent(t);s.removeContent(m);s.removeContent(o);s.removeContent(r);s.removeContent(u);s.removeContent(v);}}function A(){var E=w.getRequestFromElement(q(this));f.setText(E.initiatorType||'');g.setText(E.entryType||'');n.setText(E.name);n.setHref(E.name);var F=w.getRequestDuration(E);var G=E.fetchStartOffset+E.startTime;var J=G+F;h.setText(w.formatTime(G));j.setText(w.formatTime(J));k.setText(w.formatDuration(F));}function B(){var E=w.getRequestFromElement(q(this));var F=E.fetchStartOffset;var G=w.getRequestDuration(E);var J=F+E.startTime;var K=J+G;var N=w.getRequestRequestStart(E)+F;var O=w.getRequestResponseStart(E)+F;var Q=N-J;var R=O-N;var U=K-O;var V=Math.floor(100*R/G);var W=Math.floor(100*U/G);var X=Math.floor(100*Q/G);var Y='<span class="sapUiInteractionTitleSection"><div class="sapUiInteractionTitleText">{Title}</div><div class="sapUiInteractionTitleSubText">{Subtitle}</div></span>';var Z='<div class="sapUiInteractionTitle">';Z+=Y.replace('{Title}','PREPROCESSING').replace('{Subtitle}',w.formatDuration(Q));Z+=Y.replace('{Title}','SERVER').replace('{Subtitle}',w.formatDuration(R));Z+=Y.replace('{Title}','CLIENT').replace('{Subtitle}',w.formatDuration(U));Z+='</div>';d.setContent(Z);var $=E.initiatorType||E.entryType;var _=w.getRequestColorClass($);var a1=_+'70';var b1="<span class='sapUiSupportIntProgressBar "+a1+"'' style=\"width:calc("+X+"% - 1px)\"></span><span class='sapUiSupportIntProgressBarSeparator'></span>";var c1="<span class='sapUiSupportIntProgressBar "+_+"' style=\"width:calc("+V+"% - 1px)\"></span>"+"<span class='sapUiSupportIntProgressBarSeparator'></span>";var d1="<span class='sapUiSupportIntProgressBar "+a1+"'' style=\"width:calc("+W+"% - 1px)\"></span>";var e1="<div class='sapUiSupportIntProgressBarParent'>"+b1+c1+d1+"</div>";p.setContent(e1);}function C(){var y=new P({placement:sap.m.PlacementType.Auto,contentWidth:"400px",showHeader:false,showArrow:true,verticalScrolling:true,horizontalScrolling:false,content:[D()]}).addStyleClass('sapUiSupportPopover');y.attachAfterOpen(function(E){E.getSource().$().focus();});return y;}function D(){d=new H();p=new H();e=new sap.m.Button({icon:I.getIconURI("decline"),type:"Transparent",press:function(){y.close();}}).addStyleClass("sapUiSupportReqPopoverCloseButton");e.setTooltip("Close");f=new T().addStyleClass("sapUiSupportIntRequestText");g=new T().addStyleClass("sapUiSupportIntRequestText");n=new a({target:"_blank",wrapping:true}).addStyleClass("sapUiSupportIntRequestLink");h=new T().addStyleClass("sapUiSupportIntRequestText");j=new T().addStyleClass("sapUiSupportIntRequestText");k=new T().addStyleClass("sapUiSupportIntRequestText");l=new b({text:"SAP STATISTICS FOR ODATA CALLS"});t=new L({text:"Gateway Total"}).addStyleClass("sapUiSupportIntRequestLabel");m=new T().addStyleClass("sapUiSupportIntRequestText");o=new L({text:"Framework"}).addStyleClass("sapUiSupportIntRequestLabel");r=new T().addStyleClass("sapUiSupportIntRequestText");u=new L({text:"Application"}).addStyleClass("sapUiSupportIntRequestLabel");v=new T().addStyleClass("sapUiSupportIntRequestText");s=new S({maxContainerCols:2,minWidth:400,labelMinWidth:100,editable:false,layout:"ResponsiveGridLayout",labelSpanM:3,emptySpanM:0,columnsM:1,breakpointM:0,content:[new b({text:"REQUEST DATA"}),new L({text:"Initiator Type"}).addStyleClass("sapUiSupportIntRequestLabel"),f,new L({text:"Entry Type"}).addStyleClass("sapUiSupportIntRequestLabel"),g,new L({text:"Name"}).addStyleClass("sapUiSupportIntRequestLabel"),n,new L({text:"Start Time"}).addStyleClass("sapUiSupportIntRequestLabel"),h,new L({text:"End Time"}).addStyleClass("sapUiSupportIntRequestLabel"),j,new L({text:"Duration"}).addStyleClass("sapUiSupportIntRequestLabel"),k]});return[d,p,e,s];}};c.prototype.getRequestFromElement=function($){var d=$.parents('li[data-request-index]');var e=$.parents('li[data-interaction-index]');var i=parseInt(e.attr('data-interaction-index'),10);var r=parseInt(d.attr('data-request-index'),10);var f=this.interactions[i].requests[r];return f;};c.prototype.attachInteractionDetailsPopover=function(){var s,d,e,p,r,f,g,h,j,k;var t=this;var l=q('.sapUiInteractionItemDiv.sapUiInteractionTreeItem .sapUiInteractionTreeItemRight');if(l.length){var o=n();for(var i=0;i<l.length;i++){l[i].addEventListener('click',function(v){m.call(this);var w=q(this).children()[0];o.openBy(w);});}}function m(){var $=q(this).parent().parent();var v=parseInt($.attr('data-interaction-index'),10);var w=t.interactions[v];if(!w){return;}var x=w.end-w.start;e.setText(t.formatDuration(x));p.setText(t.formatDuration(x-w.roundtrip));r.setText(t.formatDuration(w.requestTime));f.setText(t.formatDuration(w.roundtrip));g.setText(w.bytesReceived);h.setText(w.requests.length);j.setText(t.formatTime(w.start));k.setText(t.formatTime(w.end));}function n(){var o=new P({placement:sap.m.PlacementType.Auto,contentWidth:"350px",showHeader:false,showArrow:true,verticalScrolling:true,horizontalScrolling:false,content:[u()]}).addStyleClass('sapUiSupportPopover');o.attachAfterOpen(function(E){E.getSource().$().focus();});return o;}function u(){d=new sap.m.Button({icon:I.getIconURI("decline"),type:"Transparent",press:function(){o.close();}}).addStyleClass("sapUiSupportIntPopoverCloseButton");d.setTooltip("Close");e=new T().addStyleClass("sapUiSupportIntRequestText");p=new T().addStyleClass("sapUiSupportIntRequestText");r=new T().addStyleClass("sapUiSupportIntRequestText");f=new T().addStyleClass("sapUiSupportIntRequestText");g=new T().addStyleClass("sapUiSupportIntRequestText");h=new T().addStyleClass("sapUiSupportIntRequestText");j=new T().addStyleClass("sapUiSupportIntRequestText");k=new T().addStyleClass("sapUiSupportIntRequestText");s=new S({maxContainerCols:2,minWidth:400,labelMinWidth:100,editable:false,layout:"ResponsiveGridLayout",labelSpanM:7,emptySpanM:0,columnsM:1,breakpointM:0,content:[new b({text:"INTERACTION DATA"}),new L({text:"E2E Duration"}).addStyleClass("sapUiSupportIntRequestLabel"),e,new L({text:"Client Processing Duration"}).addStyleClass("sapUiSupportIntRequestLabel"),p,new L({text:"Total Requests Duration"}).addStyleClass("sapUiSupportIntRequestLabel"),r,new L({text:"Roundtrip Duration"}).addStyleClass("sapUiSupportIntRequestLabel"),f,new L({text:"Bytes Received"}).addStyleClass("sapUiSupportIntRequestLabel"),g,new L({text:"Request Count"}).addStyleClass("sapUiSupportIntRequestLabel"),h,new L({text:"Start Time"}).addStyleClass("sapUiSupportIntRequestLabel"),j,new L({text:"End Time"}).addStyleClass("sapUiSupportIntRequestLabel"),k]}).addStyleClass("sapUiSupportIntPopoverForm");return[d,s];}};c.prototype.renderRequestPart=function(r,s,e,d){if(this.actualStartTime>e||this.actualEndTime<s){return;}e=Math.min(e,this.actualEndTime);s=Math.max(s,this.actualStartTime);var l=100/this.timeRange*(s-this.actualStartTime);var f=100/this.timeRange*(e-this.actualStartTime);var w=f-l;r.write('<span style="margin-left: '+l+'%; width: '+w+'%" class="sapUiInteractionTimeframe sapUiInteractionTimeRequestFrame '+d+'"></span>');};c.prototype.getRequestDuration=function(r){if(r.duration>0){return r.duration;}var e=r.responseStart||r.requestStart||r.fetchStart;return e-r.startTime;};c.prototype.getRequestRequestStart=function(r){if(r.requestStart>0){return r.requestStart;}return r.fetchStart||r.startTime;};c.prototype.getRequestResponseStart=function(r){if(r.responseStart>0){return r.responseStart;}return r.requestStart||r.fetchStart||r.startTime;};c.prototype.pad0=function(i,w){return("000"+String(i)).slice(-w);};c.prototype.formatGridLineDuration=function(d){var o=this.actualStartTime-this.startTime;d+=o;return d>100?(d/1000).toFixed(2)+' s':d.toFixed(0)+' ms';};c.prototype.formatDuration=function(d){d=Math.max(d,0);if(d<3){return d.toFixed(2)+' ms';}return d>=1000?(d/1000).toFixed(3)+' s':d.toFixed(0)+' ms';};c.prototype.formatTime=function(n){var N=new Date(n);return this.pad0(N.getHours(),2)+":"+this.pad0(N.getMinutes(),2)+":"+this.pad0(N.getSeconds(),2)+"."+this.pad0(N.getMilliseconds(),3);};c.prototype.renderIcon=function(r,e){var h=this.getIconHTML(e);r.write(h);};c.prototype.getIconHTML=function(e){var i=e?c.collapseIcon:c.expandIcon;var d="sapUiIcon sapUiInteractionTreeIcon";if(f&&!f.suppressMirroring){d+=" sapUiIconMirrorInRTL";}var h='<span aria-hidden="true" expanded="'+e+'" class="'+d+'" ';var f=I.getIconInfo(i);if(f){h+='data-sap-ui-icon-content="'+f.content+'"';h+=' style="font-family:\'SAP-icons\'"';}h+="></span>";return h;};return c;});
