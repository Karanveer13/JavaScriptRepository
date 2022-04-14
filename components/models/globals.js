var PMS = PMS || {};
PMS.models = {};
PMS.constants = {};
PMS.collections = {};
PMS.globals = PMS.globals || {};
Backbone.ajax = function () {
    console.log(arguments);
    arguments[0].headers = PMS.fn.getAuthHeaders();
    if (_.last(arguments[0].url) !== '/') {
        arguments[0].url = arguments[0].url + "/";
    }
    return Backbone.$.ajax.apply(Backbone.$, arguments);
};

//Profile Friends
//addfriend
// PMS.globals.profile_friends.add({
//     profile : PMS.globals.profile.get('resource_uri'),
//     p_friend : '/user/81/'
// })
// _.last(PMS.globals.profile_friends.models).save();
PMS.constants.MONTHNAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
PMS.models.profile_friend = Backbone.Model.extend({
    defaults: {

        user: null,
        profile: null,

    }
})
PMS.collections.profile_friends = Backbone.Collection.extend({
    model: PMS.models.profile_friend,
    initialize: function () {
        this.fetch();
    },
    parse: function (response, options) {
        return response.objects;
    },
    url: 'https://expenser-app-django-heroku.herokuapp.com/profile_friend/'
})
//Profile 
PMS.models.profile = Backbone.Model.extend({
    defaults: {
    },
    initialize: function () {
        this.fetch();
    },
    parse: function (response, options) {
        console.log(options);
        return response.objects[0];
    },
    urlRoot: 'https://expenser-app-django-heroku.herokuapp.com/profile/',

})


//Users
PMS.models.user = Backbone.Model.extend({
    defaults: {
        resource_uri: null,
        username: null
    }

})
PMS.collections.users = Backbone.Collection.extend({
    model: PMS.models.user,
    url: "https://expenser-app-django-heroku.herokuapp.com/user/",
    initialize: function () {
        this.fetch();
    },
    parse: function (response, options) {
        console.log(response);
        console.log(options);
        return response.objects;
    },
})

//Group
PMS.models.group = Backbone.Model.extend({
    defaults: {
        creator: null,
        name: null,
    },

});
PMS.collections.groups = Backbone.Collection.extend({
    model: PMS.models.group,
    parse: function (response, options) {
        console.log(response);
        console.log(options);
        return response.objects;
    },
    url: 'https://expenser-app-django-heroku.herokuapp.com/group/',
});

//Expenses


//add expense
// PMS.globals.expenses.add({
//     amount: '2000',  
// group: '/group/6/',
// payer: '/group_friend/4/',
// reason: 'Party' 

// });
// _.last(PMS.globals.expenses.models).save()
PMS.models.expense = Backbone.Model.extend({
    defaults: {

    },

})


PMS.collections.expenses = Backbone.Collection.extend({
    model: PMS.models.expense,
    comparator: function (a, b) {
        return b.get('created_at') > a.get('created_at') ? 1 : -1;

    },

    initialize: function () {

    },
    parse: function (response, options) {
        console.log(response);
        return response.objects;
    },
    url: `https://expenser-app-django-heroku.herokuapp.com/expense/`
})

//Splitterss

PMS.models.splitter = Backbone.Model.extend({
    defaults: {

    }
});
PMS.collections.splitters = Backbone.Collection.extend({
    model: PMS.models.splitter,
    initialize: function () {
        this.fetch();
    },
    parse: function (response, options) {
        console.log(response);
        return response.objects;
    },
    url: `https://expenser-app-django-heroku.herokuapp.com/expense_splitter/`
});

//Group Friends

PMS.models.group_friend = Backbone.Model.extend({
    defaults: {}
});

PMS.collections.group_friends = Backbone.Collection.extend({
    model: PMS.models.group_friend,
    initialize: function () {
        this.fetch();
    },
    parse: function (response) {
        return response.objects;
    },
    url: 'https://expenser-app-django-heroku.herokuapp.com/group_friend/'
});

//Settle
PMS.models.settlement = Backbone.Model.extend({
    defaults: {

    }
})
PMS.collections.settlements = Backbone.Collection.extend({
    model: PMS.models.settlement,
    initialize: function () {
        this.fetch();
    },
    parse: function (response) {
        return response.objects;
    },
    url: 'https://expenser-app-django-heroku.herokuapp.com/settle/'

});

//All Group Balance
PMS.models.group_balance =  Backbone.Model.extend({
    defaults: {

    }
});
PMS.collections.all_group_balances =  Backbone.Collection.extend({
    model: PMS.models.group_balance,
    initialize: function () {

    },

})