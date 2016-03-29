/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/core/Control","sap/ui/core/delegate/ScrollEnablement","./WizardStep","./WizardProgressNavigator","./Button"],function(q,l,C,S,W,a,B){"use strict";var b=C.extend("sap.m.Wizard",{metadata:{library:"sap.m",properties:{width:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"auto"},height:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"100%"},showNextButton:{type:"boolean",group:"Behavior",defaultValue:true},finishButtonText:{type:"string",group:"Appearance",defaultValue:"Review"},enableBranching:{type:"boolean",group:"Behavior",defaultValue:false}},defaultAggregation:"steps",aggregations:{steps:{type:"sap.m.WizardStep",multiple:true,singularName:"step"},_progressNavigator:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_nextButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"}},events:{stepActivate:{parameters:{index:{type:"int"}}},complete:{parameters:{}}}}});b.CONSTANTS={MINIMUM_STEPS:3,MAXIMUM_STEPS:8,ANIMATION_TIME:300,LOCK_TIME:450,SCROLL_OFFSET:65};b.prototype.init=function(){this._stepCount=0;this._stepPath=[];this._scrollLocked=false;this._scroller=this._initScrollEnablement();this._resourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._initProgressNavigator();};b.prototype.onBeforeRendering=function(){if(!this._isMinStepCountReached()||this._isMaxStepCountExceeded()){q.sap.log.error("The Wizard is supposed to handle from 3 to 8 steps.");}this._initNextButton();this._saveInitialValidatedState();var s=this._getStartingStep();if(this._stepPath.indexOf(s)<0){this._activateStep(s);this._updateProgressNavigator();this._setNextButtonPosition();}};b.prototype.onAfterRendering=function(){this._attachScrollHandler();};b.prototype.exit=function(){this._scroller.destroy();this._scroller=null;this._stepPath=null;this._stepCount=null;this._scrollLocked=null;this._resourceBundle=null;};b.prototype.validateStep=function(s){if(!this._containsStep(s)){q.sap.log.error("The wizard does not contain this step");return this;}s.setProperty("validated",true,true);this._updateNextButtonState();return this;};b.prototype.invalidateStep=function(s){if(!this._containsStep(s)){q.sap.log.error("The wizard does not contain this step");return this;}s.setProperty("validated",false,true);this._updateNextButtonState();return this;};b.prototype.nextStep=function(){var c=this._getProgressNavigator().getProgress()-1;var d=this._stepPath[c];this.validateStep(d);this._handleNextButtonPress();return this;};b.prototype.previousStep=function(){var p=this._getProgressNavigator().getProgress()-2;if(p>=0){this.discardProgress(this._stepPath[p]);}return this;};b.prototype.getProgress=function(){return this._getProgressNavigator().getProgress();};b.prototype.getProgressStep=function(){return this._stepPath[this.getProgress()-1];};b.prototype.goToStep=function(s,f){if(this._scrollLocked||!this.getVisible()){return;}this._scrollLocked=true;this._scroller.scrollTo(0,this._getStepScrollOffset(s),b.CONSTANTS.ANIMATION_TIME);q.sap.delayedCall(b.CONSTANTS.LOCK_TIME,this,function(){var p=this._getProgressNavigator();if(!p){this._scrollLocked=false;return;}p._updateCurrentStep(this._stepPath.indexOf(s)+1);this._scrollLocked=false;if(f||f===undefined){this._focusFirstStepElement(s);}});return this;};b.prototype.discardProgress=function(s){var p=this.getProgress(),c=this._stepPath,d=this._stepPath.indexOf(s)+1;if(d>p||d<=0){q.sap.log.warning("The given step is either not yet reached, or is not present in the wizard control.");return;}this._getProgressNavigator().discardProgress(d);this._updateNextButtonState();this._setNextButtonPosition();this._restoreInitialValidatedState(d);this._stepPath[d-1]._markAsLast();for(var i=d;i<c.length;i++){c[i]._deactivate();if(c[i].getSubsequentSteps().length>1){c[i].setNextStep(null);}}if(s.getSubsequentSteps().length>1){s.setNextStep(null);}c.splice(d);this._updateProgressNavigator();return this;};b.prototype.setShowNextButton=function(v){this.setProperty("showNextButton",v,true);if(this._getNextButton()){this._getNextButton().setVisible(v);}return this;};b.prototype.setFinishButtonText=function(v){this.setProperty("finishButtonText",v,true);this._updateNextButtonState();return this;};b.prototype.getFinishButtonText=function(){if(this.getProperty("finishButtonText")==="Review"){return this._resourceBundle.getText("WIZARD_FINISH");}else{return this.getProperty("finishButtonText");}};b.prototype.addStep=function(w){if(this._isMaxStepCountExceeded()){q.sap.log.error("The Wizard is supposed to handle up to 8 steps.");return this;}this._incrementStepCount();return this.addAggregation("steps",w);};b.prototype.insertStep=function(w,i){throw new Error("Dynamic step insertion is not yet supported.");};b.prototype.removeStep=function(w){throw new Error("Dynamic step removal is not yet supported.");};b.prototype.removeAllSteps=function(){this._resetStepCount();return this.removeAllAggregation("steps");};b.prototype.destroySteps=function(){this._resetStepCount();this._getProgressNavigator().setStepCount(this._getStepCount());return this.destroyAggregations("steps");};b.prototype._initScrollEnablement=function(){return new S(this,null,{scrollContainerId:this.getId()+"-step-container",horizontal:false,vertical:true});};b.prototype._initProgressNavigator=function(){var t=this,p=new a(this.getId()+"-progressNavigator",{stepChanged:this._handleStepChanged.bind(this),stepActivated:this._handleStepActivated.bind(this)});p._setOnEnter(function(e,s){var c=t._stepPath[s];q.sap.delayedCall(b.CONSTANTS.ANIMATION_TIME,t,function(){this._focusFirstStepElement(c);});});this.setAggregation("_progressNavigator",p);};b.prototype._initNextButton=function(){if(this._getNextButton()){return;}this.setAggregation("_nextButton",this._createNextButton());this._setNextButtonPosition();};b.prototype._createNextButton=function(){var f=this._getStartingStep(),i=(f)?f.getValidated():true,n=new B(this.getId()+"-nextButton",{text:this._resourceBundle.getText("WIZARD_STEP")+" "+2,type:sap.m.ButtonType.Emphasized,enabled:i,press:this._handleNextButtonPress.bind(this),visible:this.getShowNextButton()});n.addStyleClass("sapMWizardNextButton");n.addEventDelegate({onAfterRendering:this._toggleNextButtonVisibility},this);this._nextButton=n;return n;};b.prototype._handleNextButtonPress=function(){var i,p=this._getProgressNavigator(),c=this._stepPath[this._stepPath.length-1],d=p.getProgress(),s=p.getStepCount();if(this.getEnableBranching()){i=c._isLeaf();}else{i=d===s;}if(i){this.fireComplete();}else{if(d===s){p.setStepCount(s+1);p.rerender();}p.incrementProgress();}this._updateNextButtonState();};b.prototype._toggleNextButtonVisibility=function(){q.sap.delayedCall(0,this,function(){if(this._getNextButton().getEnabled()){this._getNextButton().addStyleClass("sapMWizardNextButtonVisible");}else{this._getNextButton().removeStyleClass("sapMWizardNextButtonVisible");}});};b.prototype._getStepScrollOffset=function(s){var c=s.$().position().top,d=this._scroller.getScrollTop(),p=this._stepPath[this.getProgress()-1],e=0;if(!sap.ui.Device.system.phone&&!q.sap.containsOrEquals(p.getDomRef(),this._nextButton.getDomRef())){e=this._nextButton.$().outerHeight();}return(d+c)-(b.CONSTANTS.SCROLL_OFFSET+e);};b.prototype._focusFirstStepElement=function(s){var $=s.$();if($.firstFocusableDomRef()){$.firstFocusableDomRef().focus();}};b.prototype._handleStepChanged=function(e){if(this._scrollLocked){return;}var p=e.getParameter("current")-2;var c=this._stepPath[p];var s=this._getNextStep(c,p);var f=sap.ui.Device.system.desktop?true:false;this.goToStep(s,f);};b.prototype._handleStepActivated=function(e){var i=e.getParameter("index"),p=i-2,c=this._stepPath[p];c._complete();var n=this._getNextStep(c,p);this._activateStep(n);this._updateProgressNavigator();this.fireStepActivate({index:i});this._setNextButtonPosition();};b.prototype._isMaxStepCountExceeded=function(){if(this.getEnableBranching()){return false;}var s=this._getStepCount();return s>=b.CONSTANTS.MAXIMUM_STEPS;};b.prototype._isMinStepCountReached=function(){var s=this._getStepCount();return s>=b.CONSTANTS.MINIMUM_STEPS;};b.prototype._getStepCount=function(){return this._stepCount;};b.prototype._incrementStepCount=function(){this._stepCount+=1;this._getProgressNavigator().setStepCount(this._getStepCount());};b.prototype._decrementStepCount=function(){this._stepCount-=1;this._getProgressNavigator().setStepCount(this._getStepCount());};b.prototype._resetStepCount=function(){this._stepCount=0;this._getProgressNavigator().setStepCount(this._getStepCount());};b.prototype._getProgressNavigator=function(){return this.getAggregation("_progressNavigator");};b.prototype._saveInitialValidatedState=function(){if(this._initialValidatedState){return;}this._initialValidatedState=this.getSteps().map(function(s){return s.getValidated();});};b.prototype._restoreInitialValidatedState=function(c){var s=this._stepPath,d=this.getSteps();for(var i=c;i<s.length;i++){var e=s[i];var f=d.indexOf(e);var g=this._initialValidatedState[f];e.setValidated(g);}};b.prototype._getNextStep=function(s,p){if(!this.getEnableBranching()){return this.getSteps()[p+1];}if(p<0){return this._getStartingStep();}var n=s._getNextStepReference();if(n===null){throw new Error("The wizard is in branching mode, and no next step is defined for "+"the current step, please set one.");}if(!this._containsStep(n)){throw new Error("The next step that you have defined is not part of the wizard steps aggregation."+"Please add it to the wizard control.");}var c=s.getSubsequentSteps();if(c.length>0&&!s._containsSubsequentStep(n.getId())){throw new Error("The next step that you have defined is not contained inside the subsequentSteps"+" association of the current step.");}return n;};b.prototype._setNextButtonPosition=function(){if(sap.ui.Device.system.phone){return;}var c=this._getNextButton(),p=this._getProgressNavigator().getProgress(),d=this._stepPath[p-1];if(d){d.addContent(c);}};b.prototype._updateNextButtonState=function(){if(!this._getNextButton()){return;}var i,s=this._getStepCount(),n=this._getNextButton(),p=this.getProgress(),c=this._stepPath[p-1].getValidated();if(this.getEnableBranching()){i=this._stepPath[p-1]._isLeaf();}else{i=p===s;}n.setEnabled(c);if(i){n.setText(this.getFinishButtonText());}else{n.setText(this._resourceBundle.getText("WIZARD_STEP")+" "+(p+1));}};b.prototype._getNextButton=function(){return this._nextButton;};b.prototype._updateProgressNavigator=function(){var p=this._getProgressNavigator(),c=this._getStartingStep(),d=this.getSteps(),s=[c.getTitle()],e=[c.getIcon()],f=1;if(this.getEnableBranching()){while(!c._isLeaf()&&c._getNextStepReference()!==null){f++;c=c._getNextStepReference();s.push(c.getTitle());e.push(c.getIcon());}p.setVaryingStepCount(c._isBranched());p.setStepCount(f);}else{s=d.map(function(g){return g.getTitle();});e=d.map(function(g){return g.getIcon();});}p.setStepTitles(s);p.setStepIcons(e);};b.prototype._getStartingStep=function(){return this.getSteps()[0];};b.prototype._attachScrollHandler=function(){var c=this.getDomRef("step-container");c.onscroll=this._scrollHandler.bind(this);};b.prototype._scrollHandler=function(e){if(this._scrollLocked){return;}var s=e.target.scrollTop,p=this._getProgressNavigator(),c=this._stepPath[p.getCurrentStep()-1].getDomRef(),d=c.clientHeight,f=c.offsetTop,g=100;this._scrollLocked=true;if(s+g>=f+d){p.nextStep();}if(s+g<=f){p.previousStep();}this._scrollLocked=false;};b.prototype._containsStep=function(s){return this.getSteps().some(function(o){return o===s;});};b.prototype._activateStep=function(s){if(this._stepPath.indexOf(s)>=0){throw new Error("The step that you are trying to activate has already been visited. You are creating "+"a loop inside the wizard.");}this._stepPath.push(s);s._activate();};return b;},true);
