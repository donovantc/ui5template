/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./InputBase','sap/ui/model/type/Date','sap/ui/core/date/UniversalDate','./library'],function(q,I,D,U,l){"use strict";var a=I.extend("sap.m.DatePicker",{metadata:{library:"sap.m",properties:{displayFormat:{type:"string",group:"Appearance",defaultValue:null},valueFormat:{type:"string",group:"Data",defaultValue:null},dateValue:{type:"object",group:"Data",defaultValue:null},displayFormatType:{type:"string",group:"Appearance",defaultValue:""},secondaryCalendarType:{type:"sap.ui.core.CalendarType",group:"Appearance",defaultValue:null}}}});(function(){a.prototype.init=function(){I.prototype.init.apply(this,arguments);this._bIntervalSelection=false;this._bValid=true;this._oMinDate=new Date(1,0,1);this._oMinDate.setFullYear(1);this._oMaxDate=new Date(9999,11,31,23,59,59,99);};a.prototype.exit=function(){I.prototype.exit.apply(this,arguments);if(this._oPopup){if(this._oPopup.isOpen()){this._oPopup.close();}delete this._oPopup;}if(this._oCalendar){this._oCalendar.destroy();delete this._oCalendar;}this._sUsedDisplayPattern=undefined;this._sUsedDisplayCalendarType=undefined;this._oDisplayFormat=undefined;this._sUsedValuePattern=undefined;this._sUsedValueCalendarType=undefined;this._oValueFormat=undefined;};a.prototype.invalidate=function(o){if(!o||o!=this._oCalendar){sap.ui.core.Control.prototype.invalidate.apply(this,arguments);}};a.prototype.setWidth=function(w){return I.prototype.setWidth.call(this,w||"100%");};a.prototype.getWidth=function(w){return this.getProperty("width")||"100%";};a.prototype.applyFocusInfo=function(F){this._bFocusNoPopup=true;I.prototype.applyFocusInfo.apply(this,arguments);};a.prototype.onfocusin=function(E){if(!q(E.target).hasClass("sapUiIcon")){I.prototype.onfocusin.apply(this,arguments);}this._bFocusNoPopup=undefined;};a.prototype.oninput=function(E){I.prototype.oninput.call(this,E);if(E.isMarked("invalid")){return;}if(this.getDomRef()&&this._$label){var v=this._$input.val();this._$label.css("display",v?"none":"inline");}};a.prototype.onsapshow=function(E){b.call(this);E.preventDefault();};a.prototype.onsaphide=a.prototype.onsapshow;a.prototype.onsappageup=function(E){d.call(this,1,"day");E.preventDefault();};a.prototype.onsappageupmodifiers=function(E){if(!E.ctrlKey&&E.shiftKey){d.call(this,1,"month");}else{d.call(this,1,"year");}E.preventDefault();};a.prototype.onsappagedown=function(E){d.call(this,-1,"day");E.preventDefault();};a.prototype.onsappagedownmodifiers=function(E){if(!E.ctrlKey&&E.shiftKey){d.call(this,-1,"month");}else{d.call(this,-1,"year");}E.preventDefault();};a.prototype.onkeypress=function(E){if(!E.charCode||E.metaKey||E.ctrlKey){return;}var F=g.call(this,true);var C=String.fromCharCode(E.charCode);if(C&&F.sAllowedCharacters&&F.sAllowedCharacters.indexOf(C)<0){E.preventDefault();}};a.prototype.onclick=function(E){if(q(E.target).hasClass("sapUiIcon")){b.call(this);}};a.prototype.setValue=function(v){v=this.validateProperty("value",v);var o=this.getValue();if(v==o){return this;}else{this._lastValue=v;}this.setProperty("value",v,true);this._bValid=true;var h;if(v){h=this._parseValue(v);if(!h||h.getTime()<this._oMinDate.getTime()||h.getTime()>this._oMaxDate.getTime()){this._bValid=false;q.sap.log.warning("Value can not be converted to a valid date",this);}}if(this._bValid){this.setProperty("dateValue",h,true);}if(this.getDomRef()){var O;if(h){O=this._formatValue(h);}else{O=v;}if(this._$input.val()!==O){this._$input.val(O);this._setLabelVisibility();this._curpos=this._$input.cursorPos();}}return this;};a.prototype.setDateValue=function(o){if(o&&!(o instanceof Date)){throw new Error("Date must be a JavaScript date object; "+this);}if(q.sap.equal(this.getDateValue(),o)){return this;}if(o&&(o.getTime()<this._oMinDate.getTime()||o.getTime()>this._oMaxDate.getTime())){this._bValid=false;o=undefined;}else{this._bValid=true;this.setProperty("dateValue",o,true);}var v=this._formatValue(o,true);if(v!==this.getValue()){this._lastValue=v;}this.setProperty("value",v,true);if(this.getDomRef()){var O=this._formatValue(o);if(this._$input.val()!==O){this._$input.val(O);this._setLabelVisibility();this._curpos=this._$input.cursorPos();}}return this;};a.prototype.setValueFormat=function(v){this.setProperty("valueFormat",v,true);var V=this.getValue();if(V){var o=this._parseValue(V);if(!o||o.getTime()<this._oMinDate.getTime()||o.getTime()>this._oMaxDate.getTime()){this._bValid=false;q.sap.log.warning("Value can not be converted to a valid date",this);}else{this._bValid=true;this.setProperty("dateValue",o,true);}}return this;};a.prototype.setDisplayFormat=function(s){this.setProperty("displayFormat",s,true);var o=this._formatValue(this.getDateValue());if(this.getDomRef()&&(this._$input.val()!==o)){this._$input.val(o);this._curpos=this._$input.cursorPos();}return this;};a.prototype.setDisplayFormatType=function(s){if(s){var F=false;for(var t in sap.ui.core.CalendarType){if(t==s){F=true;break;}}if(!F){throw new Error(s+" is not a valid calendar type"+this);}}this.setProperty("displayFormatType",s,true);this.setDisplayFormat(this.getDisplayFormat());return this;};a.prototype.setSecondaryCalendarType=function(C){this._bSecondaryCalendarTypeSet=true;this.setProperty("secondaryCalendarType",C,true);if(this._oCalendar){this._oCalendar.setSecondaryCalendarType(C);}return this;};a.prototype.onChange=function(E){if(!this.getEditable()||!this.getEnabled()){return;}var v=this._$input.val();var o=this._formatValue(this.getDateValue());if(v==o&&this._bValid){return;}var h;this._bValid=true;if(v!=""){h=this._parseValue(v,true);if(!h||h.getTime()<this._oMinDate.getTime()||h.getTime()>this._oMaxDate.getTime()){this._bValid=false;h=undefined;}else{v=this._formatValue(h);}}if(this.getDomRef()&&(this._$input.val()!==v)){this._$input.val(v);this._curpos=this._$input.cursorPos();if(this._$label){this._$label.css("display",v?"none":"inline");}}if(h){v=this._formatValue(h,true);}if(v!==this._lastValue){this.setProperty("value",v,true);if(this._bValid){this.setProperty("dateValue",h,true);}this._lastValue=v;this.fireChangeEvent(v,{valid:this._bValid});if(this._oPopup&&this._oPopup.isOpen()){this._oCalendar.focusDate(h);var s=this._oDateRange.getStartDate();if((!s&&h)||(s&&h&&s.getTime()!=h.getTime())){this._oDateRange.setStartDate(new Date(h));}else if(s&&!h){this._oDateRange.setStartDate(undefined);}}}};a.prototype._getInputValue=function(v){v=(typeof v=="undefined")?this._$input.val():v.toString();var o=this._parseValue(v,true);v=this._formatValue(o,true);return v;};a.prototype.updateDomValue=function(v){this._bCheckDomValue=true;v=(typeof v=="undefined")?this._$input.val():v.toString();this._curpos=this._$input.cursorPos();var o=this._parseValue(v,true);v=this._formatValue(o);if(this.isActive()&&(this._$input.val()!==v)){this._$input.val(v);this._$input.cursorPos(this._curpos);}this._setLabelVisibility();return this;};a.prototype._parseValue=function(v,h){var F=g.call(this,h);var o=F.parse(v);return o;};a.prototype._formatValue=function(o,v){var V="";if(o){var F=g.call(this,!v);V=F.format(o);}return V;};a.prototype._getPlaceholder=function(){var p=this.getPlaceholder();if(!p){var B=this.getBinding("value");if(B&&B.oType&&(B.oType instanceof D)){p=B.oType.getOutputPattern();}else{p=this.getDisplayFormat();}if(!p){p="medium";}if(p=="short"||p=="medium"||p=="long"){var L=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();var o=sap.ui.core.LocaleData.getInstance(L);p=o.getDatePattern(p);}}return p;};function _(){if(!this._oPopup){q.sap.require("sap.ui.core.Popup");this._oPopup=new sap.ui.core.Popup();this._oPopup.setAutoClose(true);this._oPopup.setDurations(0,0);this._oPopup.attachOpened(e,this);}if(!this._oCalendar){sap.ui.getCore().loadLibrary("sap.ui.unified");q.sap.require("sap.ui.unified.library");this._oCalendar=new sap.ui.unified.Calendar(this.getId()+"-cal",{intervalSelection:this._bIntervalSelection});this._oDateRange=new sap.ui.unified.DateRange();this._oCalendar.addSelectedDate(this._oDateRange);this._oCalendar.attachSelect(this._selectDate,this);this._oCalendar.attachCancel(c,this);this._oCalendar.attachEvent("_renderMonth",f,this);this._oPopup.setContent(this._oCalendar);if(this.$().closest(".sapUiSizeCompact").length>0){this._oCalendar.addStyleClass("sapUiSizeCompact");}if(this._bSecondaryCalendarTypeSet){this._oCalendar.setSecondaryCalendarType(this.getSecondaryCalendarType());}this._oCalendar.setPopupMode(true);this._oCalendar.setParent(this,undefined,true);}var C;var B=this.getBinding("value");if(B&&B.oType&&(B.oType instanceof D)){C=B.oType.oOutputFormat.oFormatOptions.calendarType;}if(!C){C=this.getDisplayFormatType();}if(C){this._oCalendar.setPrimaryCalendarType(C);}var v=this._formatValue(this.getDateValue());if(v!=this._$input.val()){this.onChange();}this._fillDateRange();this._oPopup.setAutoCloseAreas([this.getDomRef()]);var h=sap.ui.core.Popup.Dock;var A;if(this.getTextAlign()==sap.ui.core.TextAlign.End){A=h.EndBottom+"-4";this._oPopup.open(0,h.EndTop,A,this,null,"fit",true);}else{A=h.BeginBottom+"-4";this._oPopup.open(0,h.BeginTop,A,this,null,"fit",true);}}a.prototype._fillDateRange=function(){var o=this.getDateValue();if(o){this._oCalendar.focusDate(new Date(o));if(!this._oDateRange.getStartDate()||this._oDateRange.getStartDate().getTime()!=o.getTime()){this._oDateRange.setStartDate(new Date(o.getTime()));}}else{this._oCalendar.focusDate(new Date());if(this._oDateRange.getStartDate()){this._oDateRange.setStartDate(undefined);}}};function b(){if(this.getEditable()&&this.getEnabled()){if(!this._oPopup||!this._oPopup.isOpen()){_.call(this);}else{c.call(this);}}}a.prototype._selectDate=function(E){var s=this._oCalendar.getSelectedDates();var o=this.getDateValue();var h;var v="";if(s.length>0){h=s[0].getStartDate();}if(!q.sap.equal(h,o)){this.setDateValue(h);v=this.getValue();this.fireChangeEvent(v,{valid:true});if(this.getDomRef()){this._curpos=this._$input.val().length;this._$input.cursorPos(this._curpos);}}else if(!this._bValid){v=this._formatValue(h);if(v!=this._$input.val()){this._bValid=true;if(this.getDomRef()){this._$input.val(v);}this.fireChangeEvent(v,{valid:true});}}this._oPopup.close();this._bFocusNoPopup=true;this.focus();};function c(E){if(this._oPopup&&this._oPopup.isOpen()){this._oPopup.close();this._bFocusNoPopup=true;this.focus();}}function d(n,u){var o=this.getDateValue();var C=this._$input.cursorPos();if(o&&this.getEditable()&&this.getEnabled()){var h=new U(o.getTime());o=new U(o.getTime());switch(u){case"day":h.setDate(h.getDate()+n);break;case"month":h.setMonth(h.getMonth()+n);var m=(o.getMonth()+n)%12;if(m<0){m=12+m;}while(h.getMonth()!=m){h.setDate(h.getDate()-1);}break;case"year":h.setFullYear(h.getFullYear()+n);while(h.getMonth()!=o.getMonth()){h.setDate(h.getDate()-1);}break;default:break;}if(h.getTime()<this._oMinDate.getTime()){h=new U(this._oMinDate.getTime());}else if(h.getTime()>this._oMaxDate.getTime()){h=new U(this._oMaxDate.getTime());}this.setDateValue(new Date(h.getTime()));this._curpos=C;this._$input.cursorPos(this._curpos);var v=this.getValue();this.fireChangeEvent(v,{valid:true});}}function e(E){this._renderedDays=this._oCalendar.$("-Month0-days").find(".sapUiCalItem").length;}function f(E){var i=E.getParameter("days");if(i>this._renderedDays){this._renderedDays=i;this._oPopup._applyPosition(this._oPopup._oLastPosition);}}function g(h){var p="";var r=false;var F;var B=this.getBinding("value");var C;if(B&&B.oType&&(B.oType instanceof D)){p=B.oType.getOutputPattern();r=!!B.oType.oOutputFormat.oFormatOptions.relative;C=B.oType.oOutputFormat.oFormatOptions.calendarType;}if(!p){if(h){p=(this.getDisplayFormat()||"medium");C=this.getDisplayFormatType();}else{p=(this.getValueFormat()||"short");C=sap.ui.core.CalendarType.Gregorian;}}if(!C){C=sap.ui.getCore().getConfiguration().getCalendarType();}if(h){if(p==this._sUsedDisplayPattern&&C==this._sUsedDisplayCalendarType){F=this._oDisplayFormat;}}else{if(p==this._sUsedValuePattern&&C==this._sUsedValueCalendarType){F=this._oValueFormat;}}if(!F){if(p=="short"||p=="medium"||p=="long"){F=sap.ui.core.format.DateFormat.getInstance({style:p,strictParsing:true,relative:r,calendarType:C});}else{F=sap.ui.core.format.DateFormat.getInstance({pattern:p,strictParsing:true,relative:r,calendarType:C});}if(h){this._sUsedDisplayPattern=p;this._sUsedDisplayCalendarType=C;this._oDisplayFormat=F;}else{this._sUsedValuePattern=p;this._sUsedValueCalendarType=C;this._oValueFormat=F;}}return F;}}());return a;},true);
