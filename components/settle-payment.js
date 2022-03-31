define([], function () {
  var model = {};
  (model.model = Backbone.Model.extend({
    default: {
      name: "test_expense",
      statements: [],
      receiver: "",
      payer: "",
      amount: 0,
    },
  })),
    (model.view = Backbone.View.extend({
      model: model.model,
      initialize: function () {
        this.template = _.template($("#settle-payment-template").html());
        // this.model.set("receiver", "Karanveer");
        // this.model.set(
        //   "amount",
        //   this.model
        //     .get("statements")
        //     .filter((stat) => "Karanveer" === stat.lender)[0].amount
        // );
        this.model.on(
          "change",
          (e) => {
            var model = this.model;
            console.log(e);
            if (e.changed.hasOwnProperty("receiver")) {
              model.set(
                "amount",
                model
                  .get("statements")
                  .filter((stat) => e.changed.receiver === stat.lender)[0]
                  .amount
              );
            }
            this.render(1);
          },
          this
        );
        this.render();
      },
      handle: new _.extend({}, Backbone.Events),
      events: {
        // "mouseout .settle-input": "changeHandler",
        "click .fa-solid.fa-circle-xmark": "close",
        "click #settle-payment-btn": "addExpense",
        "change #receiver": "payerSelected",
      },
      payerSelected: function (e) {
        this.model.set("receiver", $("#receiver").val());
      },
      close: function () {
        $(this.el).empty();
        $(this.el).hide();
        $(this.el).unbind();
      },
      addExpense: function () {
        console.log(this.model);
        $(this.el).hide();
        $(this.el).unbind();
      },
      changeHandler: function (e) {
        console.log(e);
        this.model.set(
          "amount_due_post_payment",
          this.model.get("amount_due") - e.target.value
        );
        this.model.set("amount", e.target.value);
        if (this.model.get("amount") > this.model.get("amount_due")) {
          alert("Enter amount is more than required");
          this.model.set("amount", this.model.get("amount_due"));
        }
      },
      render: function (init = 0) {
        this.$el.show();
        this.$el.html(this.template(this.model.toJSON()));
        if (init === 1) {
          $("#receiver").val(this.model.get("receiver"));
        }

        return this;
      },
    }));
  return model;
});
