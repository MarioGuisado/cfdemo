sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("com.xtendhr.web.controller.Create", {
        onInit: function () {
        },
        onNavBack: function(){
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        },
        onSave: function(){
            var self = this;
            var url_provided = "/srv/create?destinationX=sfdemo&path=cust_CompanyShirts_S0026472321";
            var newData =  {  
                "__metadata": {
                   "uri": "https://apisalesdemo2.successfactors.eu/odata/v2/cust_CompanyShirts_S0026472321(000001L)",
                   "type": "SFOData.cust_CompanyShirts_S0026472321"
               },
               "cust_ShirtSize": self.getView().byId("ID2create").getValue(),
               "cust_ShirtColor": self.getView().byId("ID3create").getValue(),
               "cust_Employee": self.getView().byId("ID4create").getValue()
           };
            $.ajax({
                url: url_provided,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(newData),
                success: function(data){
                    console.log(data);
                    self.getView().byId("ID2create").setValue("");
                    self.getView().byId("ID3create").setValue("");
                    self.getView().byId("ID4create").setValue("");
                    self.getOwnerComponent().getRouter().navTo("RouteMain", {});
                },
                error: function(error){
                    console.log(error);
                }
            });
        }
    });
});
