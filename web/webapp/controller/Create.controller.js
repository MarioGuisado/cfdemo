sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
function (Controller, Fragment, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.xtendhr.web.controller.Create", {
        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("Create").attachMatched(this.onRouteMatched, this);
            this.userSelected = undefined;
        },
        onValueHelpRequest: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();

			if (!this._pValueHelpDialog) {
				this._pValueHelpDialog = Fragment.load({
					id: oView.getId(),
					name: "com.xtendhr.web.view.ValueHelpDialog",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._pValueHelpDialog.then(function(oDialog) {
                var oBinding = oDialog.getBinding("items");
                if (oBinding) {
                    oBinding.filter([new Filter("displayName", FilterOperator.Contains, sInputValue)]);
                }
				oDialog.open(sInputValue);
			});
		},

		onValueHelpSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("displayName", FilterOperator.Contains, sValue);

			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onValueHelpClose: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			oEvent.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			this.byId("UserInput").setValue(oSelectedItem.getTitle());
            this.userSelected = oSelectedItem.getDescription();
		},
        onRouteMatched: function () {	
            var self = this;
            $.ajax({
                url: "/srv/destination?path=PickListValueV2?$filter=PickListV2_id eq 'Shirt_Sizes_S0026472321'&$format=json",
                type: "GET",
                contentType: "application/json",
                success: function(data){
                    var oModel = new sap.ui.model.json.JSONModel(data);
			        self.getView().setModel(oModel, "createModelShirtSize");
                },
                error: function(error){
                    console.log(error);
                }
            });
            $.ajax({
                url: "/srv/destination?path=PickListValueV2?$filter=PickListV2_id eq 'Shirt_Color_S0026472321'&$format=json",
                type: "GET",
                contentType: "application/json",
                success: function(data){
                    var oModel = new sap.ui.model.json.JSONModel(data);
			        self.getView().setModel(oModel, "createModelShirtColor");
                },
                error: function(error){
                    console.log(error);
                }
            });
            $.ajax({
                url: "/srv/destination?path=User?$top=20&$format=json",
                type: "GET",
                contentType: "application/json",
                success: function(data){
                    var oModel = new sap.ui.model.json.JSONModel(data);
			        self.getView().setModel(oModel, "Users");
                },
                error: function(error){
                    console.log(error);
                }
            });
		},
        onNavBack: function(){
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        },
        onSave: function(){
            var self = this;
            var url_provided = "/srv/create?path=cust_CompanyShirts_S0026472321";
            
            var shirtSize = self.getView().byId("createShirtSizeComboBox").getSelectedKey();
            var shirtColor = self.getView().byId("createShirtColorComboBox").getSelectedKey();
            var employee = this.userSelected;
        
            var newData = {  
                "cust_ShirtSize": shirtSize,
                "cust_ShirtColor": shirtColor,
                "cust_Employee": employee
            };
        
            $.ajax({
                url: url_provided,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(newData),
                success: function(data){
                    self.getView().byId("createShirtSizeComboBox").setSelectedKey("");
                    self.getView().byId("createShirtColorComboBox").setSelectedKey("");
                    self.getView().byId("UserInput").setValue("");
                    self.getOwnerComponent().getRouter().navTo("RouteMain", {});
                },
                error: function(error){
                    console.log(error);
                }
            });
        }
        
    });
});
