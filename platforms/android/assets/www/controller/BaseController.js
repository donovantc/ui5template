sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
   ],function(Controller, History){
	 "use strict";
	 return Controller.extend("controller.BaseController", {
          onInit : function(){			  
          },
		 
		 /*
		  * Returns the router for the current controller
		  */
		 getRouter : function(){
			 return sap.ui.core.UIComponent.getRouterFor(this);
		 },
		 
		 /*
		  * Navigate backwards from the current route
		  */
		 onNavBack : function(oEvent){
			 var oHistory, sPreviousHash;
			 
			 oHistory = History.getInstance();
			 sPreviousHash = oHistory.getPreviousHash();
			 
			 if(sPreviousHash !== undefined){
				 window.history.go(-1);
			 } else {
				 this._navTo("master", {}, true /*no history*/);
			 }
		 },
		 
		 /*
		  * This function shows a message dialog and can be used by any extending controllers
		  */
		 showDialog : function(title, message, beginButtonText, endButtonText, onBeginFunction, onEndFunction, state, extraButtonText, extraButtonFunction){
			 if (this.getOwnerComponent().messageDialog.isOpen())
				 this.getOwnerComponent().messageDialog.onCloseDialog();
			 this.getOwnerComponent().messageDialog.open(this.getView(),title, message, beginButtonText, endButtonText, onBeginFunction, onEndFunction, state, extraButtonText
				 , extraButtonFunction);
		 },
		 
		 /*
		  * This function shows a message dialog and can be used by any extending controllers. It attaches a dialog close event to any of the function parameters provided
		  */
		 showDialogAttachClose : function(title, message, beginButtonText, endButtonText, onBeginFunction, onEndFunction, state, extraButtonText, extraButtonFunction){
			 var that = this;
			 var oOwner = this.getOwnerComponent();
			 var onBeginFunctionWithClose = function(oEvent){
				 oOwner.messageDialog.onCloseDialog();
				 
				 if (onBeginFunction)
					 onBeginFunction.apply(that, oEvent);
			 };
			 
			 var onEndFunctionWithClose = function(oEvent){
				 oOwner.messageDialog.onCloseDialog();
				 
				 if(onEndFunction)
					 onEndFunction.apply(that,oEvent);
			 };
			 
			 this.showDialog(title, message, beginButtonText, endButtonText, onBeginFunctionWithClose, onEndFunctionWithClose, state, extraButtonText, extraButtonFunction);
		 }
	 });
});