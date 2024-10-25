sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
function (Controller, Fragment, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.xtendhr.web.controller.Details", {
        onInit: function () {
            this.objId = undefined;
            this.userSelected = undefined;
            this.getOwnerComponent().getRouter().getRoute("Details").attachMatched(this.onRouteMatched, this);

        },
        onRouteMatched: function (oEvent) {	
			this.objId = oEvent.getParameter("arguments").objectId;
            var url = "/srv/details?path=cust_CompanyShirts_S0026472321?$filter=externalCode eq '" + this.objId +"'%26$expand=cust_EmployeeNav"
            this.onCallSRV(url, "GET");	
            
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
        onCallSRV: function(url_provided, operation){
            var self = this;
            $.ajax({
                url: url_provided,
                type: operation,
                contentType: "application/json",
                success: function(data){
                    var localModel = new sap.ui.model.json.JSONModel(data.d.results[0]);
                    self.getView().setModel(localModel, "detailsModel");
                    self.getView().byId("externalCodeCombobox").setValue(data.d.results[0]["externalCode"]);
                    self.getView().byId("createModelShirtSize").setSelectedKey(data.d.results[0]["cust_ShirtSize"]);
                    self.getView().byId("createModelShirtColor").setSelectedKey(data.d.results[0]["cust_ShirtColor"]);
                    self.getView().byId("UserInputedit").setSelectedKey(data.d.results[0]["cust_Employee"]);
                },
                error: function(error){
                    console.log(error);
                }
            });
        },
        onNavBack: function(){
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        },
        onEdit: function(){
            var self = this;
            var url_provided = "/srv/edit?path=cust_CompanyShirts_S0026472321/upsert";

            var shirtSize = self.getView().byId("createModelShirtSize").getSelectedKey();
            var shirtColor = self.getView().byId("createModelShirtColor").getSelectedKey();
            var employee = this.userSelected;
        
            var updatedData = {
                "__metadata": {
                    "uri": "https://apisalesdemo2.successfactors.eu/odata/v2/cust_CompanyShirts_S0026472321("+this.objId+"L)",
                    "type": "SFOData.cust_CompanyShirts_S0026472321"
                },
                "cust_ShirtSize": shirtSize,
                "cust_ShirtColor": shirtColor,
                "cust_Employee": employee
            };
            $.ajax({
                url: url_provided,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(updatedData),
                success: function(data){
                    console.log(data);
                    self.getOwnerComponent().getRouter().navTo("RouteMain", {});
                },
                error: function(error){
                    console.log(error);
                }
            });
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

			this.byId("UserInputedit").setValue(oSelectedItem.getTitle());
            this.userSelected = oSelectedItem.getDescription();
		},
        onDelete: function(){
            var self = this;
            var url_provided = "/srv/delete?path=cust_CompanyShirts_S0026472321(externalCode = '"+this.objId+"')";
           
            $.ajax({
                url: url_provided,
                type: "DELETE",
                success: function(){
                    self.getOwnerComponent().getRouter().navTo("RouteMain", {});
                },
                error: function(error){
                    console.log(error);
                }
            });
        }

    });
});
