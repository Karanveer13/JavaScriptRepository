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
      events: {
        'click .expense-header': 'deleteExpense'
      },
      deleteExpense: function (e) {
        console.log('deleting expense', e);
        console.log(this.model);
        var answer = window.confirm("Do you want to delete this expense ? => " + this.model.attributes.reason);
        if (answer) {
          this.model.destroy()
            .then((res) => PMS.expenseCollectionView.render())
        }


      },
      render: function () {
        console.log(this.model);
        this.$el.html(this.template(this.model.toJSON()));
        if (!_.contains(this.model.get('settled_by'), PMS.fn.getCurrentGroupFriends().find((friend) => friend.friend.resource_uri === PMS.globals.profile.attributes.profile_friends.find((friend) => friend.user.username === PMS.fn.getUsername()).resource_uri).resource_uri)) {
          if (this.model.get('splitters').find((splitter) => splitter.e_splitter.friend.user.username === PMS.fn.getUsername())) {
            console.log('check', this.model);
            this.$('.expense-header').toggleClass("not_settled");
          }
          else {
            
          }
        }
        else{
          this.$('.expense-header').toggleClass("settled");
        }
        // console.log(this.model.get('reason'),!_.contains(this.model.get('settled_by'), PMS.globals.group_friends.find((friend) => friend.attributes.friend.user.resource_uri === PMS.globals.profile.attributes.profile_user).attributes.resource_uri))
        // if(!_.contains(this.model.get('settled_by'), PMS.globals.group_friends.find((friend) => friend.attributes.friend.user.resource_uri === PMS.globals.profile.attributes.profile_user).attributes.resource_uri))
        // {

        // }
        //this.$('.expense-header').addClass(!_.contains(this.model.get('settled_by'), PMS.globals.group_friends.find((friend) => friend.attributes.friend.user.resource_uri === PMS.globals.profile.attributes.profile_user).attributes.resource_uri) ? "not_settled" : "settled");
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
