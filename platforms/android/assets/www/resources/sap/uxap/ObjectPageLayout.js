/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/ResizeHandler","sap/ui/core/Control","sap/ui/core/CustomData","sap/ui/Device","sap/ui/core/delegate/ScrollEnablement","./ObjectPageSubSection","./ObjectPageSubSectionLayout","./LazyLoading","./ObjectPageLayoutABHelper","./library"],function(q,R,C,a,D,S,O,b,L,A,l){"use strict";var c=C.extend("sap.uxap.ObjectPageLayout",{metadata:{library:"sap.uxap",properties:{showAnchorBar:{type:"boolean",defaultValue:true},showAnchorBarPopover:{type:"boolean",defaultValue:true},upperCaseAnchorBar:{type:"boolean",defaultValue:true},height:{type:"sap.ui.core.CSSSize",defaultValue:"100%"},enableLazyLoading:{type:"boolean",defaultValue:false},subSectionLayout:{type:"sap.uxap.ObjectPageSubSectionLayout",defaultValue:b.TitleOnTop},useIconTabBar:{type:"boolean",group:"Misc",defaultValue:false},showHeaderContent:{type:"boolean",group:"Misc",defaultValue:true},useTwoColumnsForLargeScreen:{type:"boolean",group:"Appearance",defaultValue:false},showTitleInHeaderContent:{type:"boolean",group:"Appearance",defaultValue:false},showOnlyHighImportance:{type:"boolean",group:"Behavior",defaultValue:false},isChildPage:{type:"boolean",group:"Appearance",defaultValue:false},alwaysShowContentHeader:{type:"boolean",group:"Behavior",defaultValue:false},showEditHeaderButton:{type:"boolean",group:"Behavior",defaultValue:false},flexEnabled:{type:"boolean",group:"Misc",defaultValue:false}},defaultAggregation:"sections",aggregations:{sections:{type:"sap.uxap.ObjectPageSection",multiple:true,singularName:"section"},headerTitle:{type:"sap.uxap.ObjectPageHeader",multiple:false},headerContent:{type:"sap.ui.core.Control",multiple:true,singularName:"headerContent"},_anchorBar:{type:"sap.uxap.AnchorBar",multiple:false,visibility:"hidden"},_iconTabBar:{type:"sap.m.IconTabBar",multiple:false,visibility:"hidden"},_headerContent:{type:"sap.uxap.ObjectPageHeaderContent",multiple:false,visibility:"hidden"}},events:{toggleAnchorBar:{parameters:{fixed:{type:"boolean"}}},editHeaderButtonPress:{}},designTime:true}});c.prototype.init=function(){this._bFirstRendering=true;this._bDomReady=false;this._bStickyAnchorBar=false;this._iStoredScrollPosition=0;this._bInternalAnchorBarVisible=true;this._$opWrapper=[];this._$anchorBar=[];this._$headerTitle=[];this._$stickyAnchorBar=[];this._$headerContent=[];this._$stickyHeaderContent=[];this._bMobileScenario=false;this._oSectionInfo={};this._aSectionBases=[];this._sScrolledSectionId="";this._iScrollToSectionDuration=600;this._$spacer=[];this.iHeaderContentHeight=0;this.iStickyHeaderContentHeight=0;this.iHeaderTitleHeight=0;this.iHeaderTitleHeightStickied=0;this.iAnchorBarHeight=0;this.iTotalHeaderSize=0;this._iResizeId=R.register(this,this._onUpdateScreenSize.bind(this));this._oLazyLoading=new L(this);this._oABHelper=new A(this);};c.prototype.onBeforeRendering=function(){this._bMobileScenario=l.Utilities.isPhoneScenario();this._bTabletScenario=l.Utilities.isTabletScenario();this._bHContentAlwaysExpanded=this._checkAlwaysShowContentHeader();this._initializeScroller();this._storeScrollLocation();this._getHeaderContent().setContentDesign(this._getHeaderDesign());this._oABHelper._getAnchorBar().setUpperCase(this.getUpperCaseAnchorBar());this._applyUxRules();if(!q.isEmptyObject(this._oSectionInfo)&&this._bFirstRendering){this._preloadSectionsOnBeforeFirstRendering();this._bFirstRendering=false;}this._bStickyAnchorBar=false;var h=this.getHeaderTitle();if(h&&h.getAggregation("_expandButton")){h.getAggregation("_expandButton").attachPress(this._handleExpandButtonPress,this);}};c.prototype._preloadSectionsOnBeforeFirstRendering=function(){var t;if(!this.getEnableLazyLoading()){t=this.getUseIconTabBar()?[this._oFirstVisibleSection]:this.getSections();}else{var s=this.getUseIconTabBar()?this._grepCurrentTabSectionBases():this._aSectionBases;t=this._oLazyLoading.getSubsectionsToPreload(s);}this._connectModelsForSections(t);};c.prototype._grepCurrentTabSectionBases=function(){var f=[],s=this._oCurrentTabSection||this._oFirstVisibleSection;if(s){var d=s.getId();this._aSectionBases.forEach(function(o){if(o.getParent().getId()===d){f.push(o);}});}return f;};c.prototype.onAfterRendering=function(){this._ensureCorrectParentHeight();this._cacheDomElements();this._$opWrapper.on("scroll",this._onScroll.bind(this));if(this._bDomReady&&this.$().parents(":hidden").length===0){this._onAfterRenderingDomReady();}else{q.sap.delayedCall(c.HEADER_CALC_DELAY,this,this._onAfterRenderingDomReady);}};c.prototype._onAfterRenderingDomReady=function(){this._bDomReady=true;this._adjustHeaderHeights();if(this.getUseIconTabBar()){this._setCurrentTabSection(this._oStoredSection||this._oFirstVisibleSection);}this._initAnchorBarScroll();this.getHeaderTitle()&&this.getHeaderTitle()._shiftHeaderTitle();this._setSectionsFocusValues();this._restoreScrollPosition();};c.prototype.exit=function(){if(this._oScroller){this._oScroller.destroy();this._oScroller=null;}if(this._iResizeId){R.deregister(this._iResizeId);}};c.prototype.setShowOnlyHighImportance=function(v){var o=this.getShowOnlyHighImportance();if(o!==v){this.setProperty("showOnlyHighImportance",v,true);this.getSections().forEach(function(s){s._updateImportance();});}return this;};c.prototype.setIsHeaderContentAlwaysExpanded=function(v){var o=this.getAlwaysShowContentHeader();var s=(D.system.phone||D.system.tablet);if(o!==v){this.setProperty("alwaysShowContentHeader",v,s);}return this;};c.prototype._initializeScroller=function(){if(this._oScroller){return;}var e=(D.os.blackberry&&D.os.version>=10.0&&D.os.version<11.0);this._oScroller=new S(this,this.getId()+"-scroll",{horizontal:false,vertical:true,zynga:e,preventDefault:true,nonTouchScrolling:"scrollbar",scrollbarClass:"sapUxAPObjectPageScroll"});};c.prototype._ensureCorrectParentHeight=function(){if(this.getParent().getHeight&&["","auto"].indexOf(this.getParent().getHeight())!==-1){this.$().parent().css("height","100%");}};c.prototype._cacheDomElements=function(){this._$headerTitle=q.sap.byId(this.getId()+"-headerTitle");this._$anchorBar=q.sap.byId(this.getId()+"-anchorBar");this._$stickyAnchorBar=q.sap.byId(this.getId()+"-stickyAnchorBar");this._$opWrapper=q.sap.byId(this.getId()+"-opwrapper");this._$spacer=q.sap.byId(this.getId()+"-spacer");this._$headerContent=q.sap.byId(this.getId()+"-headerContent");this._$stickyHeaderContent=q.sap.byId(this.getId()+"-stickyHeaderContent");this._$contentContainer=q.sap.byId(this.getId()+"-scroll");};c.prototype._handleExpandButtonPress=function(e){this._expandCollapseHeader(true);};c.prototype._toggleStickyHeader=function(e){this._bIsHeaderExpanded=e;this._$headerTitle.toggleClass("sapUxAPObjectPageHeaderStickied",!e);this._toggleHeaderStyleRules(!e);};c.prototype._expandCollapseHeader=function(e){var h=this.getHeaderTitle();if(this._bHContentAlwaysExpanded){return;}if(e&&this._bStickyAnchorBar){if(h&&h.getIsActionAreaAlwaysVisible()&&!h.getIsObjectTitleAlwaysVisible()){h._setActionsPaddingStatus(e);}this._$headerContent.css("height",this.iHeaderContentHeight).children().appendTo(this._$stickyHeaderContent);this._toggleStickyHeader(e);}else if(!e&&this._bIsHeaderExpanded){this._$headerContent.css("height","auto").append(this._$stickyHeaderContent.children());this._$stickyHeaderContent.children().remove();this._toggleStickyHeader(e);}};c.prototype._applyUxRules=function(i){var s,d,v,V,e,f,g,F,o;s=this.getSections()||[];V=0;f=this.getShowAnchorBar();g=this.getUseIconTabBar();F=null;this._cleanMemory();s.forEach(function(h){if(!h.getVisible()){return true;}this._registerSectionBaseInfo(h);d=h.getSubSections()||[];v=0;o=null;d.forEach(function(j){if(!j.getVisible()){return true;}this._registerSectionBaseInfo(j);e=j.getVisibleBlocksCount();if(e===0){j._setInternalVisible(false,i);q.sap.log.info("ObjectPageLayout :: noVisibleBlock UX rule matched","subSection "+j.getTitle()+" forced to hidden");}else{j._setInternalVisible(true,i);j._setInternalTitleVisible(true,i);v++;if(!o){o=j;}}},this);if(v==0){h._setInternalVisible(false,i);q.sap.log.info("ObjectPageLayout :: noVisibleSubSection UX rule matched","section "+h.getTitle()+" forced to hidden");}else{h._setInternalVisible(true,i);h._setInternalTitleVisible(true,i);if(!F){F=h;}if(this.getSubSectionLayout()===b.TitleOnTop&&v===1&&o.getTitle().trim()!==""){q.sap.log.info("ObjectPageLayout :: TitleOnTop.sectionGetSingleSubSectionTitle UX rule matched","section "+h.getTitle()+" is taking its single subsection title "+o.getTitle());h._setInternalTitle(o.getTitle(),i);o._setInternalTitleVisible(false,i);}else{h._setInternalTitle("",i);}V++;}if(g){h._setInternalTitleVisible(false,i);}},this);if(V<=1){f=false;q.sap.log.info("ObjectPageLayout :: notEnoughVisibleSection UX rule matched","anchorBar forced to hidden");}else if(F&&f){F._setInternalTitleVisible(false,i);q.sap.log.info("ObjectPageLayout :: firstSectionTitleHidden UX rule matched","section "+F.getTitle()+" title forced to hidden");}if(f){this._oABHelper._buildAnchorBar();}this._setInternalAnchorBarVisible(f,i);this._oFirstVisibleSection=F;};c.prototype.setUseIconTabBar=function(v){var o=this.getUseIconTabBar();if(v!=o){this._applyUxRules();}this.setProperty("useIconTabBar",v);return this;};c.prototype._setCurrentTabSection=function(s){if(!s){return;}var o;if(s instanceof sap.uxap.ObjectPageSubSection){o=s;s=s.getParent();}else{o=this._getFirstVisibleSubSection(s);}if(this._oCurrentTabSection!==s){this._renderSection(s);this._oCurrentTabSection=s;}this._oCurrentTabSubSection=o;};c.prototype._renderSection=function(s){var $=this.$().find(".sapUxAPObjectPageContainer"),r;if(s&&$.length){r=sap.ui.getCore().createRenderManager();r.renderControl(s);r.flush($[0]);}r.destroy();};c.prototype.setShowAnchorBarPopover=function(v,s){this._oABHelper._buildAnchorBar();this._oABHelper._getAnchorBar().setShowPopover(v);return this.setProperty("showAnchorBarPopover",v,true);};c.prototype._getInternalAnchorBarVisible=function(){return this._bInternalAnchorBarVisible;};c.prototype._setInternalAnchorBarVisible=function(v,i){if(v!=this._bInternalAnchorBarVisible){this._bInternalAnchorBarVisible=v;if(i===true){this.invalidate();}}};c.prototype._adjustLayout=function(e,i,n){if(!this._bDomReady){return;}if(this._iLayoutTimer){q.sap.log.debug("ObjectPageLayout :: _adjustLayout","delayed by "+c.DOM_CALC_DELAY+" ms because of dom modifications");q.sap.clearDelayedCall(this._iLayoutTimer);}if(i){this._updateScreenHeightSectionBasesAndSpacer();this._iLayoutTimer=undefined;}else{this._bNeedLazyLoading=this._bNeedLazyLoading!==undefined||n;this._iLayoutTimer=q.sap.delayedCall(c.DOM_CALC_DELAY,this,function(){q.sap.log.debug("ObjectPageLayout :: _adjustLayout","re-evaluating dom positions");this._updateScreenHeightSectionBasesAndSpacer();if(this._bNeedLazyLoading){this._oLazyLoading.doLazyLoading();}this._bNeedLazyLoading=undefined;this._iLayoutTimer=undefined;});}};c.prototype._adjustLayoutAndUxRules=function(){q.sap.log.debug("ObjectPageLayout :: _adjustLayout","refreshing ux rules");var s=this._getSelectedSectionId();this._applyUxRules(true);this._setSelectedSectionId(s);this._adjustLayout(null,false,true);};c.prototype._getSelectedSectionId=function(){var o=this.getAggregation("_anchorBar"),s;if(o&&o.getSelectedSection()){s=o.getSelectedSection().getId();}return s;};c.prototype._setSelectedSectionId=function(s){var o=this.getAggregation("_anchorBar"),d=s&&this._oSectionInfo[s];if(!d){return;}if(o&&d.buttonId){o.setSelectedButton(d.buttonId);}};c.prototype.isFirstRendering=function(){return this._bFirstRendering;};c.prototype._cleanMemory=function(){var o=this.getAggregation("_anchorBar");if(o){o.destroyContent();}this._oSectionInfo={};this._aSectionBases=[];};c.prototype._registerSectionBaseInfo=function(s){this._oSectionInfo[s.getId()]={$dom:[],positionTop:0,positionTopMobile:0,realTop:0.0,buttonId:"",isSection:(s instanceof l.ObjectPageSection),sectionReference:s};this._aSectionBases.push(s);};c.prototype.scrollToSection=function(i,d,o){var s=sap.ui.getCore().byId(i);if(this.getUseIconTabBar()){this._setCurrentTabSection(s);var t=s;if(t instanceof sap.uxap.ObjectPageSubSection){t=t.getParent();}this.getAggregation("_anchorBar").setSelectedButton(this._oSectionInfo[t.getId()].buttonId);}if(this._bIsHeaderExpanded){this._expandCollapseHeader(false);}o=o||0;s._expandSection();this._adjustLayout(null,true);d=this._computeScrollDuration(d,s);var e=this._computeScrollPosition(s);if(this._sCurrentScrollId!=i){this._sCurrentScrollId=i;if(this._iCurrentScrollTimeout){clearTimeout(this._iCurrentScrollTimeout);this._$contentContainer.parent().stop(true,false);}this._iCurrentScrollTimeout=q.sap.delayedCall(d,this,function(){this._sCurrentScrollId=undefined;this._iCurrentScrollTimeout=undefined;});this._preloadSectionsOnScroll(s);this.getHeaderTitle()&&this.getHeaderTitle()._shiftHeaderTitle();this._scrollTo(e+o,d);}};c.prototype._computeScrollDuration=function(i,t){var d=parseInt(i,10);d=d>=0?d:this._iScrollToSectionDuration;if(this.getUseIconTabBar()&&((t instanceof sap.uxap.ObjectPageSection)||this._isFirstVisibleSubSection(t))&&this._bStickyAnchorBar){d=0;}return d;};c.prototype._computeScrollPosition=function(t){var f=t&&(t instanceof sap.uxap.ObjectPageSection),i=t.getId();var s=this._bMobileScenario||f?this._oSectionInfo[i].positionTopMobile:this._oSectionInfo[i].positionTop;if(this.getUseIconTabBar()&&((t instanceof sap.uxap.ObjectPageSection)||this._isFirstVisibleSubSection(t))&&!this._bStickyAnchorBar){s-=this.iHeaderContentHeight;}return s;};c.prototype._preloadSectionsOnScroll=function(t){var i=t.getId(),T;if(!this.getEnableLazyLoading()&&this.getUseIconTabBar()){T=(t instanceof sap.uxap.ObjectPageSection)?t:t.getParent();this._connectModelsForSections([T]);}if(this.getEnableLazyLoading()){var s=this.getUseIconTabBar()?this._grepCurrentTabSectionBases():this._aSectionBases;T=this._oLazyLoading.getSubsectionsToPreload(s,i);if(D.system.desktop){q.sap.delayedCall(50,this,function(){this._connectModelsForSections(T);});}else{this._connectModelsForSections(T);}}};c.prototype.getScrollingSectionId=function(){return this._sScrolledSectionId;};c.prototype.setDirectScrollingToSection=function(d){this.sDirectSectionId=d;};c.prototype.getDirectScrollingToSection=function(){return this.sDirectSectionId;};c.prototype.clearDirectScrollingToSection=function(){this.sDirectSectionId=null;};c.prototype._scrollTo=function(y,t){if(this._oScroller){q.sap.log.debug("ObjectPageLayout :: scrolling to "+y);this._oScroller.scrollTo(0,y,t);}return this;};c.prototype._updateScreenHeightSectionBasesAndSpacer=function(){var i,o,s,p,P,h=0;this.iScreenHeight=this.$().height();if(this.iHeaderContentHeight&&!this._bHContentAlwaysExpanded){h=this.iHeaderTitleHeightStickied-this.iHeaderTitleHeight;}this._aSectionBases.forEach(function(d){var I=this._oSectionInfo[d.getId()],$=d.$(),e;if(!I||!$.length){return;}I.$dom=$;I.realTop=$.position().top;var H=(d._getInternalTitleVisible()&&(d.getTitle().trim()!==""));var f=!I.isSection&&d.getAggregation("actions").length>0;if(!I.isSection&&!H&&!f){I.realTop=$.find(".sapUiResponsiveMargin.sapUxAPBlockContainer").position().top;}I.positionTop=Math.ceil(I.realTop)-this.iAnchorBarHeight-h;if(I.isSection){e=d.$("header");}else{e=d.$("headerTitle");}if(e.length>0){I.positionTopMobile=Math.ceil(e.position().top)+e.outerHeight()-this.iAnchorBarHeight-h;}else{I.positionTopMobile=I.positionTop;}if(this._bMobileScenario){if(P){this._oSectionInfo[P].positionBottom=I.positionTop;}P=d.getId();o=d;}else{if(I.isSection){if(P){this._oSectionInfo[P].positionBottom=I.positionTop;this._oSectionInfo[p].positionBottom=I.positionTop;}P=d.getId();p=null;}else{if(p){this._oSectionInfo[p].positionBottom=I.positionTop;}p=d.getId();o=d;}}},this);if(o){i=this._$spacer.position().top-this._oSectionInfo[o.getId()].realTop;if(this._bMobileScenario){this._oSectionInfo[P].positionBottom=this._oSectionInfo[P].positionTop+i;}else{this._oSectionInfo[p].positionBottom=this._oSectionInfo[p].positionTop+i;this._oSectionInfo[P].positionBottom=this._oSectionInfo[p].positionTop+i;}if(i<this.iScreenHeight){if(this._isSpacerRequired(o,i)){if(this.iHeaderContentHeight||this._bHContentAlwaysExpanded){s=this.iScreenHeight-i-this.iHeaderTitleHeight-h-this.iAnchorBarHeight;}else{s=this.iScreenHeight-i-this.iAnchorBarHeight;}if(this._bMobileScenario){s+=(this._oSectionInfo[o.getId()].positionTopMobile-this._oSectionInfo[o.getId()].positionTop);}}else{s=0;}this._$spacer.height(s+"px");q.sap.log.debug("ObjectPageLayout :: bottom spacer is now "+s+"px");}}};c.prototype._isSpacerRequired=function(o,i){var s=this.getAggregation("_anchorBar").getSelectedSection(),I=this.getUseIconTabBar()&&s&&s.getSubSections().length===1,d=this.getSections().length===1&&this.getSections()[0].getSubSections().length===1;if(I||d){return false;}if(this._bStickyAnchorBar){return true;}var e=((this._oSectionInfo[o.getId()].realTop+i)<=this.iScreenHeight);if(!e){return true;}if(!this._isFirstVisibleSubSection(this._oCurrentTabSubSection)){return true;}return false;};c.prototype._isFirstVisibleSubSection=function(s){if(s){var o=this._oSectionInfo[s.getId()];if(o){return o.realTop===(this.iAnchorBarHeight+this.iHeaderContentHeight);}}return false;};c.prototype._getFirstVisibleSubSection=function(s){if(!s){return;}var f;this._aSectionBases.every(function(o){if(o.getParent()&&(o.getParent().getId()===s.getId())){f=o;return false;}return true;});return f;};c.prototype._initAnchorBarScroll=function(){this._adjustLayout(null,true);this._sScrolledSectionId="";this._onScroll({target:{scrollTop:0}});};c.prototype._setAsCurrentSection=function(s){var o,d,e;if(this._sScrolledSectionId===s){return;}q.sap.log.debug("ObjectPageLayout :: current section is "+s);this._sScrolledSectionId=s;o=this.getAggregation("_anchorBar");if(o&&this._getInternalAnchorBarVisible()){d=sap.ui.getCore().byId(s);e=d&&d instanceof O&&(d.getTitle().trim()===""||!d._getInternalTitleVisible()||d.getParent()._getIsHidden());if(e){s=d.getParent().getId();q.sap.log.debug("ObjectPageLayout :: current section is a subSection with an empty or hidden title, selecting parent "+s);}if(this._oSectionInfo[s]){o.setSelectedButton(this._oSectionInfo[s].buttonId);this._setSectionsFocusValues(s);}}};c.prototype._onUpdateScreenSize=function(e){if(!this._bDomReady){q.sap.log.info("ObjectPageLayout :: cannot _onUpdateScreenSize before dom is ready");return;}this._oLazyLoading.setLazyLoadingParameters();q.sap.delayedCall(c.HEADER_CALC_DELAY,this,function(){this._bMobileScenario=l.Utilities.isPhoneScenario();this._bTabletScenario=l.Utilities.isTabletScenario();if(this._bHContentAlwaysExpanded!=this._checkAlwaysShowContentHeader()){this.invalidate();}this._adjustHeaderHeights();this._adjustLayout(null,true);this._oScroller.scrollTo(0,this._$opWrapper.scrollTop(),0);});};c.prototype._onScroll=function(e){var s=Math.max(e.target.scrollTop,0),p,h=this.getHeaderTitle(),d=s>=(this.iHeaderContentHeight-(this.iHeaderTitleHeightStickied-this.iHeaderTitleHeight)),f,g=false;p=this.iScreenHeight;if(d&&!this._bHContentAlwaysExpanded){p-=(this.iAnchorBarHeight+this.iHeaderTitleHeightStickied);}else{if(d&&this._bHContentAlwaysExpanded){p=p-(this._$stickyAnchorBar.height()+this.iHeaderTitleHeight+this.iStickyHeaderContentHeight);}}if(this._bIsHeaderExpanded){this._expandCollapseHeader(false);}if(!this._bHContentAlwaysExpanded&&((h&&this.getShowHeaderContent())||this.getShowAnchorBar())){this._toggleHeader(d);}else if(s==0&&((h&&this.getShowHeaderContent())||this.getShowAnchorBar())){this._toggleHeader(false);}if(!this._bHContentAlwaysExpanded){this._adjustHeaderTitleBackgroundPosition(s);}q.sap.log.debug("ObjectPageLayout :: lazy loading : Scrolling at "+s,"----------------------------------------");f=this._getClosestScrolledSectionId(s,p);if(f){var i=this.getDirectScrollingToSection();if(f!==this._sScrolledSectionId){q.sap.log.debug("ObjectPageLayout :: closest id "+f,"----------------------------------------");var i=this.getDirectScrollingToSection();if(i&&i!==f){return;}this.clearDirectScrollingToSection();this._setAsCurrentSection(f);}else if(f===this.getDirectScrollingToSection()){this.clearDirectScrollingToSection();}}if(this.getEnableLazyLoading()){this._oLazyLoading.lazyLoadDuringScroll(s,e.timeStamp,p);}if(h&&this.getShowHeaderContent()&&this.getShowTitleInHeaderContent()&&h.getShowTitleSelector()){if(s===0){q.sap.byId(this.getId()+"-scroll").css("z-index","1000");g=false;}else if(!g){g=true;q.sap.byId(this.getId()+"-scroll").css("z-index","0");}}};c.prototype._getClosestScrolledSectionId=function(s,p){if(this.getUseIconTabBar()&&this._oCurrentTabSection){return this._oCurrentTabSection.getId();}var i=s+p,d;q.each(this._oSectionInfo,function(I,o){if(o.isSection||this._bMobileScenario){if(!d){d=I;}if(o.positionTop<=i&&s<=o.positionBottom){if(o.positionTop<=s&&o.positionBottom>=s){d=I;return false;}}}}.bind(this));return d;};c.prototype._toggleHeader=function(s){var h=this.getHeaderTitle();if(!this._bHContentAlwaysExpanded&&!this._bIsHeaderExpanded){this._$headerTitle.toggleClass("sapUxAPObjectPageHeaderStickied",s);}if(h&&h.getIsActionAreaAlwaysVisible()&&!h.getIsObjectTitleAlwaysVisible()){h._setActionsPaddingStatus(!s);}if(!this._bStickyAnchorBar&&s){this._restoreFocusAfter(this._convertHeaderToStickied);h&&h._adaptLayout();this._adjustHeaderHeights();}else if(this._bStickyAnchorBar&&!s){this._restoreFocusAfter(this._convertHeaderToExpanded);h&&h._adaptLayout();this._adjustHeaderHeights();}};c.prototype._restoreFocusAfter=function(m){var o=sap.ui.getCore(),d=o.byId(o.getCurrentFocusedControlId());m.call(this);if(D.system.phone!==true){if(!o.byId(o.getCurrentFocusedControlId())){d&&d.$().focus();}}return this;};c.prototype._convertHeaderToStickied=function(){if(!this._bHContentAlwaysExpanded){this._$anchorBar.css("height",this.iAnchorBarHeight).children().appendTo(this._$stickyAnchorBar);this._toggleHeaderStyleRules(true);if(this.iHeaderTitleHeight!=this.iHeaderTitleHeightStickied){this._adjustHeaderBackgroundSize();}}return this;};c.prototype._convertHeaderToExpanded=function(){if(!this._bHContentAlwaysExpanded){this._$anchorBar.css("height","auto").append(this._$stickyAnchorBar.children());this._toggleHeaderStyleRules(false);}return this;};c.prototype._toggleHeaderStyleRules=function(s){s=!!s;var v=s?"hidden":"inherit",d=this._bIsHeaderExpanded?"hidden":"inherit";this._bStickyAnchorBar=s;this._$headerContent.css("overflow",v);this._$headerContent.css("visibility",v);this._$anchorBar.css("visibility",d);this.fireToggleAnchorBar({fixed:s});};c.prototype.getScrollDelegate=function(){return this._oScroller;};c.prototype.setHeaderTitle=function(h,s){h.addEventDelegate({onAfterRendering:this._adjustHeaderHeights.bind(this)});return this.setAggregation("headerTitle",h,s);};c.prototype._adjustHeaderBackgroundSize=function(){var h=this.getHeaderTitle();if(h&&h.getHeaderDesign()=="Dark"){if(!this._bHContentAlwaysExpanded){this.iTotalHeaderSize=this.iHeaderTitleHeight+this.iHeaderContentHeight;this._$headerContent.css("background-size","100% "+this.iTotalHeaderSize+"px");}else{this.iTotalHeaderSize=this.iHeaderTitleHeight-this._$stickyAnchorBar.height();this._$stickyHeaderContent.css("background-size","100% "+this.iTotalHeaderSize+"px");}h.$().css("background-size","100% "+this.iTotalHeaderSize+"px");this._adjustHeaderTitleBackgroundPosition(0);}};c.prototype._adjustHeaderTitleBackgroundPosition=function(s){var h=this.getHeaderTitle();if(h&&h.getHeaderDesign()=="Dark"){if(this._bStickyAnchorBar){h.$().css("background-position","0px "+((this.iTotalHeaderSize-this.iHeaderTitleHeightStickied)*-1)+"px");}else{if(this._bHContentAlwaysExpanded){h.$().css("background-position","0px 0px");}else{h.$().css("background-position","0px "+(this.iHeaderTitleHeight+this.iHeaderContentHeight-this.iTotalHeaderSize-s)+"px");}}}};c.prototype._adjustHeaderHeights=function(){if(this._$headerTitle.length>0){var $=this._$headerTitle.clone();this.iHeaderContentHeight=this._$headerContent.height();this.iStickyHeaderContentHeight=this._$stickyHeaderContent.height();this.iAnchorBarHeight=this._$anchorBar.height();$.css({left:"-10000px",top:"-10000px",width:this._$headerTitle.width()+"px"});if(this._bStickyAnchorBar){this.iHeaderTitleHeightStickied=this._$headerTitle.height()-this.iAnchorBarHeight;$.removeClass("sapUxAPObjectPageHeaderStickied");$.appendTo(this._$headerTitle.parent());this.iHeaderTitleHeight=$.is(":visible")?$.height()-this.iAnchorBarHeight:0;}else{this.iHeaderTitleHeight=this._$headerTitle.is(":visible")?this._$headerTitle.height():0;$.addClass("sapUxAPObjectPageHeaderStickied");$.appendTo(this._$headerTitle.parent());this.iHeaderTitleHeightStickied=$.height();}$.remove();var p=this.iHeaderContentHeight?this.iHeaderTitleHeight:this.iHeaderTitleHeightStickied;this._$opWrapper.css("padding-top",p);this._adjustHeaderBackgroundSize();q.sap.log.info("ObjectPageLayout :: adjustHeaderHeight","headerTitleHeight: "+this.iHeaderTitleHeight+" - headerTitleStickiedHeight: "+this.iHeaderTitleHeightStickied+" - headerContentHeight: "+this.iHeaderContentHeight);}else{q.sap.log.debug("ObjectPageLayout :: adjustHeaderHeight","skipped as the objectPageLayout is being rendered");}};c.prototype._getHeaderDesign=function(){var h=this.getHeaderTitle(),d=l.ObjectPageHeaderDesign.Light;if(h!=null){d=h.getHeaderDesign();}return d;};c.prototype._getVisibleSections=function(){return this.getSections().filter(function(s){return s.getVisible()&&s._getInternalVisible();});};c.prototype._setSectionsFocusValues=function(s){var d=this._getVisibleSections()||[],$,f='0',n='-1',t="tabIndex",o,F=d[0];d.forEach(function(e){$=e.$();if(s===e.sId){$.attr(t,f);o=e;e._setSubSectionsFocusValues();}else{$.attr(t,n);e._disableSubSectionsFocus();}});if(!o&&d.length>0){F.$().attr(t,f);F._setSubSectionsFocusValues();o=F;}return o;};c.prototype.setShowHeaderContent=function(s){var o=this.getShowHeaderContent();if(o!==s){if(o&&this._bIsHeaderExpanded){this._expandCollapseHeader(false);}this.setProperty("showHeaderContent",s);this._getHeaderContent().setProperty("visible",s);}return this;};c.prototype._headerTitleChangeHandler=function(){if(!this.getShowTitleInHeaderContent()||this._bFirstRendering){return;}var r=sap.ui.getCore().createRenderManager();this.getRenderer()._rerenderHeaderContentArea(r,this);r.destroy();};c.prototype.getHeaderContent=function(){return this._getHeaderContent().getAggregation("content");};c.prototype.insertHeaderContent=function(o,i,s){return this._getHeaderContent().insertAggregation("content",o,i,s);};c.prototype.addHeaderContent=function(o,s){return this._getHeaderContent().addAggregation("content",o,s);};c.prototype.removeAllHeaderContent=function(s){return this._getHeaderContent().removeAllAggregation("content",s);};c.prototype.removeHeaderContent=function(o,s){return this._getHeaderContent().removeAggregation("content",o,s);};c.prototype.destroyHeaderContent=function(s){return this._getHeaderContent().destroyAggregation("content",s);};c.prototype.indexOfHeaderContent=function(o){return this._getHeaderContent().indexOfAggregation("content",o);};c.prototype._getHeaderContent=function(){if(!this.getAggregation("_headerContent")){this.setAggregation("_headerContent",new l.ObjectPageHeaderContent({visible:this.getShowHeaderContent(),contentDesign:this._getHeaderDesign(),content:this.getAggregation("headerContent")}),true);}return this.getAggregation("_headerContent");};c.prototype._checkAlwaysShowContentHeader=function(){return!this._bMobileScenario&&!this._bTabletScenario&&this.getShowHeaderContent()&&this.getAlwaysShowContentHeader();};c.prototype._connectModelsForSections=function(s){s=s||[];s.forEach(function(o){o.connectToModels();});};c.prototype._getHeightRelatedParameters=function(){return{iHeaderContentHeight:this.iHeaderContentHeight,iScreenHeight:this.iScreenHeight,iAnchorBarHeight:this.iAnchorBarHeight,iHeaderTitleHeightStickied:this.iHeaderTitleHeightStickied,iStickyHeaderContentHeight:this.iStickyHeaderContentHeight,iScrollTop:this._$opWrapper.scrollTop()};};c.prototype._hasVerticalScrollBar=function(){if(this._$opWrapper.length){return this._$opWrapper[0].scrollHeight>this._$opWrapper.innerHeight();}else{return!this.getUseIconTabBar();}};c.prototype._shiftHeader=function(d,p){this.$().find(".sapUxAPObjectPageHeaderTitle").css(d,p);};c.prototype._isFirstSection=function(s){var d=this._getVisibleSections();if(s===d[0]){return true;}return false;};c.prototype._restoreScrollPosition=function(){this._scrollTo(this._iStoredScrollPosition,0);};c.prototype._storeScrollLocation=function(){this._iStoredScrollPosition=this._oScroller.getScrollTop();this._oStoredSection=this._oCurrentTabSubSection||this._oCurrentTabSection;this._oCurrentTabSection=null;};c.HEADER_CALC_DELAY=350;c.DOM_CALC_DELAY=200;return c;});
