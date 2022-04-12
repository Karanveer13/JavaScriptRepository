define([], function () {
  var model = {};
  (model.model = Backbone.Model.extend({
    default: {
      name: "test_expense",
      statements: [],
      receivers: [],
      currentReceiver: "",
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
        "click #settle-payment-btn": "settlePayment",
      },
      payerSelected: function (e) {
        this.model.set("receiver", $("#receiver").val());
      },
      close: function () {
        $(this.el).empty();
        $(this.el).hide();
        $(this.el).unbind();
        this.undelegateEvents();
      },
      settlePayment: function () {
        PMS.globals.expenses.where({ group: `/group/${PMS.fn.getCurrentGroupId()}/` }).map((expense) => {
          expense.attributes.splitters.map((splitter) => {
            if (splitter.e_splitter.friend.user.username === PMS.fn.getUsername() && expense.attributes.payer.friend.user.username !== PMS.fn.getUsername()) {
              console.log(`${splitter.e_splitter.friend.user.username} owes ${splitter.owes} ${expense.attributes.payer.friend.user.username}`)
              console.log(`${splitter.e_splitter.resource_uri} owes ${splitter.owes} ${expense.attributes.payer.resource_uri} in ${expense.attributes.resource_uri}`);
              if (!_.contains(expense.attributes.payer.friend.profile, expense.attributes.settled_by)) {
                expense.attributes.settled_by.push(splitter.e_splitter.resource_uri);
                expense.save();
              }
            }
          })
        });
        
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
      renderDropDown: function () {
        var self = this;
        $("#receiver-dropdown").select2({
          placeholder: "Select reciever",
          dropdownParent: $("#settle-payment #form .input-field")[1],
          containerCssClass: "error",
          dropdownCssClass: "test",
          width: "resolve",
        });
        $("#receiver-dropdown").on("select2:select", function (e) {
          console.log('selected', e);
          self.model.set('amount', $("#receiver-dropdown").select2().find(":selected").data('amount'));
          self.model.set('currentReceiver', {
            lender: $("#receiver-dropdown").select2().find(":selected").data('name'),
            amount: $("#receiver-dropdown").select2().find(":selected").data('amount'),
            lender_profile: e.params.id,
          })
          console.log('model', self.model);
        });
      },
      render: function () {
        var self = this;
        this.$el.show();
        this.$el.html(this.template(this.model.toJSON()));



        // if (init === 1) {
        //   $("#receiver").val(this.model.get("receiver"));
        // }
        this.renderDropDown();
        return this;
      },
    }));
  return model;
});
