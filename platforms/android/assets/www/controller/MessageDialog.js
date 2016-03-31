sap.ui.define([
	"sap/ui/base/Object"
	], function (Object) {
		"use strict";
		return Object.extend("controller.MessageDialog", {
			_getDialog : function () {
				// create dialog lazily
				if (!this._oDialog) {
					// create dialog via fragment factory
					this._oDialog = sap.ui.xmlfragment("view.MessageDialog", this);
				}
				return this._oDialog;
			},
			open : function (oView, title, message, beginButtonText, endButtonText, onBeginFunction, onEndFunction, state, extraButtonText, extraButtonFunction) {
				if(this._getDialog().isOpen() === true){
					this._oDialog.destroy();
					this._oDialog = sap.ui.xmlfragment("view.MessageDialog", this);
				}
				
				var oDialog = this._getDialog();
                 // forward compact/cozy style into Dialog
			    jQuery.sap.syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);
                
				// connect dialog to view (models, lifecycle)
				oView.addDependent(oDialog);
				
				//set dialog properties
				if (title)
					oDialog.setTitle(title);
				
				oDialog.destroyContent();
				if(message)
					oDialog.addContent(new sap.m.Text({text : message}));
				
				oDialog.setType(sap.m.DialogType.Message);
				oDialog.setState(state || sap.ui.core.ValueState.None);
				
				oDialog.removeAllButtons();
				
				//set begin button
				var oBeginButton = new sap.m.Button();
				if(beginButtonText && beginButtonText !== ""){
					oBeginButton.setVisible(true);
					oBeginButton.setText(beginButtonText);
					oBeginButton.setType(sap.m.ButtonType.Default);
					if(onBeginFunction)
						oBeginButton.attachPress(onBeginFunction, oView.getController());
					else
						oBeginButton.attachPress(this.close, this);
				}
				else{
					oBeginButton.setVisible(false);
				}
				oDialog.addButton(oBeginButton.addStyleClass("sapUiTinyMarginBegin"));
						
				//set end button
				var oEndButton = new sap.m.Button();
				if(endButtonText && endButtonText !== ""){
					oEndButton.setVisible(true);
					oEndButton.setText(endButtonText);
					oEndButton.setType(sap.m.ButtonType.Default);
					if(onEndFunction)
						oEndButton.attachPress(onEndFunction, oView.getController());
					else
						onEndButton.attachPress(this.close, this);
				}
				else{
					oEndButton.setVisible(false);
				}
				oDialog.addButton(oEndButton.addStyleClass("sapUiTinyMarginBegin"));
				
				//set extra button
				var oExtraButton = new sap.m.Button();
				if(extraButtonText && extraButtonText !== ""){
					oExtraButton.setVisible(true);
					oExtraButton.setText(extraButtonText);
					oExtraButton.setType(sap.m.ButtonType.Default);
					if(extraButtonFunction)
						oExtraButton.attachPress(extraButtonFunction, oView.getController());
					else
						oExtraButton.attachPress(this.close, this);
				}else
					oExtraButton.setVisible(false);
				
				oDialog.addButton(oExtraButton.addStyleClass("sapUiTinyMarginBegin"));				
				
				// open dialog
				oDialog.open();
			},
			close : function(){
				this._getDialog().close();
			},
			onCloseDialog : function () {
				this._getDialog().close();
			},
			isOpen : function(){
				return this._getDialog().isOpen();
			}
			});
	});