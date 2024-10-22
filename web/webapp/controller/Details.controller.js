sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("com.xtendhr.web.controller.Details", {
        onInit: function () {
            this.objId = undefined;
            this.getOwnerComponent().getRouter().getRoute("Details").attachMatched(this.onRouteMatched, this);

        },
        onRouteMatched: function (oEvent) {	
			this.objId = oEvent.getParameter("arguments").objectId;
            var url = "/srv/destination?destinationX=sfdemo&path=cust_CompanyShirts_S0026472321?$filter=externalCode eq '" + this.objId +"'&$format=json"
            this.onCallSRV(url, "GET");	
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
            var url_provided = "/srv/edit?destinationX=sfdemo&path=cust_CompanyShirts_S0026472321/upsert";
           
            var updatedData = {
                "__metadata": {
                    "uri": "https://apisalesdemo2.successfactors.eu/odata/v2/cust_CompanyShirts_S0026472321("+this.objId+"L)",
                    "type": "SFOData.cust_CompanyShirts_S0026472321"
                },
                "cust_ShirtSize": self.getView().byId("ID2").getValue(),
                "cust_ShirtColor": self.getView().byId("ID3").getValue(),
                "cust_Employee": self.getView().byId("ID4").getValue()
            };
            console.log(JSON.stringify(updatedData));
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
        onDelete: function(){
            var self = this;
            var url_provided = "/srv/delete?destinationX=sfdemo&path=cust_CompanyShirts_S0026472321(externalCode = '"+this.objId+"')";
           
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
