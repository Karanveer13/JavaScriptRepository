var PMS = PMS || {};
PMS.views = PMS.views || {};
PMS.globals = PMS.globals || {};

PMS.views.friendView = Backbone.View.extend({
    tagName: "div",
    className: "friends",
    initialize: function () {
        console.log(this.model);
        this.template = _.template($("#friends-list-template").html());
        this.render();
    },
    events: {
        click: "setActive",
    },
    setActive: function () {
        var answer = window.confirm('Do you want to remove this friend ?');
        if (answer === true) {
            console.log('remove friend');
            var self = this;
            _.map(PMS.globals.profile_friends.models, function (friend) {
                if (friend.get('resource_uri') === self.model.get('resource_uri')) {
                    console.log('removing friend', friend);
                    friend.destroy({
                        success: function () {
                            console.log('deleted');
                        }
                    });
                }

            })
        }
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
})
PMS.views.friendsView = Backbone.View.extend({
    model: PMS.globals.profile_friends,
    addFriends: function () {
        console.log('add friends called');
        PMS.globals.public_users.models = PMS.globals.public_users.models.filter((user) => PMS.globals.profile_friends.models.filter((model) => model.attributes.user.resource_uri == user.attributes.resource_uri).length < 1)
        PMS.globals.addFriends = PMS.globals.addFriends || new PMS.views.addFriends({ model: PMS.globals.public_users });
    },
    initialize: function () {
        this.model.on(
            "add", (change) => {
                console.log("friend added");
                console.log(change);
                this.render();
            },
            this
        );
        $("#add-friend").click(this.addFriends);
        this.render();
    },
    render: function () {
        var self = this;
        this.$el.html(``);
        _.each(this.model.toArray(), function (friend) {
            self.$el.append(new PMS.views.friendView({ model: friend }).render().$el)
        });
        return;
    }
});

PMS.views.addFriends = Backbone.View.extend({
    el: $(".app"),
    template: _.template($("#add-friend-card-template").html()),
    events: {
        "click .fa-solid.fa-circle-xmark": "close",
        "click #add-friend-btn": "addFriend",
        "click #save-friend-btn": "saveFriend",
        "input #search-bar-input": "handleSearch"
    },
    handleSearch: function (e) {
        console.log('searched', e.target.value);
        this.model = this.original.filter((user) => user.attributes.username.toLowerCase().includes(e.target.value.toLowerCase()));
        console.log(this.model);
        this.render();
    },
    saveFriend : function()
    {
        this.close();
    },
    addFriend: function (e) {
        console.log("adding friend");
        console.log(this.model);
        console.log(e.target.dataset.resource_uri);
        PMS.globals.profile_friends.add({
            profile: PMS.globals.profile.get('resource_uri'),
            user: e.target.dataset.resource_uri
        });
        PMS.globals.profile_friends.last().save()
            .then((res) => PMS.globals.profile_friends.fetch())
            .then((res) => PMS.globals.friendsView.render())

        // var temp_group = new PMS.models.group({
        //     name: this.model.get("name"),
        //     creator: PMS.fn.getResourceUri(),
        // });
        // PMS.groupsCollection.add(
        //     temp_group
        // );
        // temp_group.save();
        // PMS.groupsCollection.fetch();
        // $("#overlay").hide();
        // $("#add-group-card").empty();
        // $("#add-group-card").hide();
        // $("#add-group-card").unbind();
    },
    close: function () {
        $("#overlay").hide();
        $("#add-friend-card").empty();
        $("#add-friend-card").hide();
        $("#add-friend-card").unbind();
        this.undelegateEvents();

    },
    initialize: function () {

        console.log(this.model);
        this.model.on(
            "change",
            (e) => {
                console.log(e);
                console.log(this.model);
            },
            this
        );
        console.log(this.model);
        $.fn.setCursorPosition = function (pos) {
            this.each(function (index, elem) {
                if (elem.setSelectionRange) {
                    elem.setSelectionRange(pos, pos);
                } else if (elem.createTextRange) {
                    var range = elem.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', pos);
                    range.moveStart('character', pos);
                    range.select();
                }
            });
            return this;
        };
        this.original = this.model;
        this.render();
    },
    render: function () {
        var searchString = $('#search-bar-input').val();
        $("#overlay").show();
        if ($("#add-friend-card")) {
            $("#add-friend-card").remove();
        }
        var self = this;

        self.$el.append(self.template(self.model));
        $('#search-bar-input').val(searchString);
        $('#search-bar-input').setCursorPosition(searchString ? searchString.length : 0);
        $('#search-bar-input').focus();

        return this;
    },
})