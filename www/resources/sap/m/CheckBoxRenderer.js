/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/ValueStateSupport'],function(q,V){"use strict";var C={};C.render=function(r,c){var e=c.getEnabled();var E=c.getEditable();r.write("<div");r.addClass("sapMCb");if(!E){r.addClass("sapMCbRo");}if(!e){r.addClass("sapMCbBgDis");}r.writeControlData(c);r.writeClasses();var t=V.enrichTooltip(c,c.getTooltip_AsString());if(t){r.writeAttributeEscaped("title",t);}if(e){r.writeAttribute("tabindex",c.getTabIndex());}r.writeAccessibilityState(c,{role:"checkbox",selected:null,checked:c.getSelected()});r.write(">");r.write("<div id='");r.write(c.getId()+"-CbBg'");r.addClass("sapMCbBg");if(e&&E&&sap.ui.Device.system.desktop){r.addClass("sapMCbHoverable");}if(!c.getActiveHandling()){r.addClass("sapMCbActiveStateOff");}r.addClass("sapMCbMark");if(c.getSelected()){r.addClass("sapMCbMarkChecked");}r.writeClasses();r.write(">");r.write("<input type='CheckBox' id='");r.write(c.getId()+"-CB'");if(c.getSelected()){r.writeAttribute("checked","checked");}if(c.getName()){r.writeAttributeEscaped('name',c.getName());}if(!e){r.write(" disabled=\"disabled\"");}if(!E){r.write(" readonly=\"readonly\"");}r.write(" /></div>");r.renderControl(c._oLabel);r.write("</div>");};return C;},true);
