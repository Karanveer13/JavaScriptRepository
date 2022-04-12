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
    // PMS.ExpenseCardModel = Backbone.Model.extend({
    //   defaults: {
    //     month: new Date().getMonth(),
    //     date: new Date().getDate(),
    //     name: "",
    //     amount: 0,
    //     owner : "",
    //     transactions: [ 
    //     ],
    //   },
    // });
    PMS.ExpenseCardView = Backbone.View.extend({
      model: new PMS.models.expense(),
      tagName: "div",
      initialize: function () {
        var self = this;
        // self.model.set('splitter_data',[]);
        // PMS.fn.getSplitterForExpense()
        //   .then((res) => _.map(res.objects, (function (expense) {
        //     if (expense.expense === self.model.get('resource_uri')) {
        //       let splitter_data = self.model.get('splitter_data') ?? null; 
        //       self.model.set('splitter_data',[...splitter_data,expense]);
        //     }
        // }))) 
        this.template = _.template($("#expense-template").html());
      },
      render: function () {
        console.log(this.model);
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      },
    });
    PMS.ExpenseCollectionView = Backbone.View.extend({
      model: PMS.globals.expenses.models,
      el: $("#expense-container"),
      initialize: function () {
        var self = this;
       
        _.bindAll(this, 'render', 'afterRender');
        var _this = this;
        this.render = _.wrap(this.render, function (render) {
          render();
          _this.afterRender();

        });


      },

      afterRender: function () {
        console.log('afterRender');
        PMS.fn.renderGroupBalance();
      },
      render: function () {
        var self = this;
        this.$el.html("");
        _.each(this.model.toArray(), function (expense) {
          console.log(expense);
          if (expense.attributes.group === `/group/${PMS.fn.getCurrentGroupId()}/`) {
            self.$el.append(
              new PMS.ExpenseCardView({ model: expense }).render().$el
            );

          }

        });
        return this;
      },
    });
  });
});
