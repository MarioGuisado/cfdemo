sap.ui.define([
    "sap/ui/core/mvc/Controller",
],
function (Controller) {
    "use strict";

    return Controller.extend("com.xtendhr.web.controller.Main", {
        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("RouteMain").attachMatched(this.onRouteMatched, this);
        },
        onRouteMatched: function(){
            this.onCallSRV('/srv/destination?path=cust_CompanyShirts_S0026472321', "GET");
        },
        onCallSRV: function(url_provided, operation){
            var self = this;
            $.ajax({
                url: url_provided,
                type: operation,
                contentType: "application/json",
                success: function(data){
                    var localModel = new sap.ui.model.json.JSONModel(data);
                    self.getView().setModel(localModel, "localModel");
                },
                error: function(error){
                   console.log(error);
                }
            });
        },
        onDetail: function(oEvent){
            var source = oEvent.getSource();
            var externalCode = source.getBindingContext("localModel").getProperty("externalCode");
            this.getOwnerComponent().getRouter().navTo("Details", {
                objectId: externalCode
            });
        },
        onCreate: function(){
            this.getOwnerComponent().getRouter().navTo("Create", {});
        }
    });
});
