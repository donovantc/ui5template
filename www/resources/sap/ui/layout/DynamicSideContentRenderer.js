/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var S="SIDE_CONTENT_LABEL";var D={};D.render=function(r,s){r.write("<div");r.writeControlData(s);r.addClass("sapUiDSC");r.writeClasses();r.addStyle("height","100%");r.writeStyles();r.write(">");this.renderSubControls(r,s);r.write("</div>");};D.renderSubControls=function(r,s){var i=s.getId(),b=s._shouldSetHeight(),p=sap.ui.getCore().getConfiguration().getRTL(),a=s.getSideContentPosition();if((a===sap.ui.layout.SideContentPosition.Begin&&!p)||(p&&a===sap.ui.layout.SideContentPosition.End)){this._renderSideContent(r,s,i,b);this._renderMainContent(r,s,i,b);}else{this._renderMainContent(r,s,i,b);this._renderSideContent(r,s,i,b);}};D.renderControls=function(r,c){var l=c.length,i=0;for(;i<l;i++){r.renderControl(c[i]);}};D._renderMainContent=function(r,s,i,b){r.write("<div id='"+i+"-MCGridCell'");if(s._iMcSpan){r.addClass("sapUiDSCSpan"+s._iMcSpan);r.writeClasses();}if(b){r.addStyle("height","100%");r.writeStyles();}r.write(">");this.renderControls(r,s.getMainContent());r.write("</div>");};D._renderSideContent=function(r,s,i,b){var a=sap.ui.Device.browser.firefox?"div":"aside";r.write("<"+a+" id='"+i+"-SCGridCell'");var m=sap.ui.getCore().getLibraryResourceBundle("sap.ui.layout");r.writeAttribute("aria-label",m.getText(S));r.writeAccessibilityState(s,{role:"complementary"});if(s._iScSpan){r.addClass("sapUiDSCSpan"+s._iScSpan);r.writeClasses();}if(b){r.addStyle("height","100%");r.writeStyles();}r.write(">");this.renderControls(r,s.getSideContent());r.write("</"+a+">");};return D;},true);
