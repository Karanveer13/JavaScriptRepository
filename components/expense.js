/* global PMS */

define([], function () {
  return (PMS.LoadExpense = () => {
    PMS.MonthNames = [
      "Jan ",
      "Feb ",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Augt",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    PMS.ExpenseCardModel = Backbone.Model.extend({
      defaults: {
        month: new Date().getMonth(),
        date: new Date().getDate(),
        name: "",
        amount: 0,
        owner : "",
        transactions: [ 
        ],
      },
    });
    PMS.ExpenseCardView = Backbone.View.extend({
      model: new PMS.ExpenseCardModel(),
      tagName: "div",
      initialize: function () {
        
        this.template = _.template($("#expense-template").html()); 
      },
      render: function () {
        console.log(this.model);
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      },
    });
    PMS.ExpenseCollection = Backbone.Collection.extend({
      model: PMS.ExpenseCardModel,
    });
    PMS.ExpenseCollectionView = Backbone.View.extend({
      model: new PMS.ExpenseCollection(),
      el: $("#expense-container"),
      initialize: function () {
        this.model.on(
          "add",
          () => {
            console.log("changed");
            this.render();
          },
          this
        );
      },
      render: function () {
        var self = this;
        this.$el.html("");
        _.each(this.model.toArray(), function (expense) {
          self.$el.append(
            new PMS.ExpenseCardView({ model: expense }).render().$el
          );
        });
      },
    });
  });
});
