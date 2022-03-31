define([], function () {
  return (PMS.LoadGroupBalance = () => {
    PMS.GroupBalanceModel = Backbone.Model.extend({
      defaults: {
        transactions: [],
      },
    });
    PMS.GroupBalanceView = Backbone.View.extend({
      model: new PMS.GroupBalanceModel(),
      el: $(".app"),
      initialize: function () {
        (this.template = _.template($("#group-balance-template").html())),
          this.render();
      },
      render: function () {
        if (this.$el.find("#group-balance")) {
          $("#group-balance").remove();
        }
        this.$el.append(this.template(this.model.toJSON()));
        return this;
      },
    });
  });
});
