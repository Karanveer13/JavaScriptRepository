var PMS = PMS || {};
PMS.fn = {
    getResourceUri: function () {
        return localStorage.getItem("expenser-resource_url");
    },
    getUserToken: function () {
        return localStorage.getItem("expenser-token");
    },
    getUsername: function () {
        return localStorage.getItem("expenser-username");
    },
    getApiToken: function () {
        return `ApiKey ${this.getUsername()}:${this.getUserToken()}`;
    },
    getAuthHeaders: function () {
        return {
            "Authorization": this.getApiToken(),
            "Content-Type": "application/json"
        }
    },
    addGroupMember: function (member_list, group_id) {
        var add_requests = [];
        var remove_requests = [];
        var group = `/group/${group_id}/`;
        var self = this;
        _.map(member_list, function (member) {

            add_requests.push(fetch(`https://expenser-app-django-heroku.herokuapp.com/group_friend/`, {
                method: "POST",
                headers: PMS.fn.getAuthHeaders(),
                body: JSON.stringify({
                    friend: member.resource_uri,
                    group: group,
                })
            }))





        });
        return Promise.all([...add_requests, remove_requests]);
    },
    getUsernameFromGroupFriend: function (group_friend) {

    },
    getSplitterForExpense: function () {
        var requestOptions = {
            method: 'GET',
            headers: this.getAuthHeaders(),
        };
        return fetch("https://expenser-app-django-heroku.herokuapp.com/expense_splitter/", requestOptions);

    },
    addSplitterForGroup: function (expense_id, splitters) {
        var self = this;
        var counter = 0;

        return new Promise((resolve, reject) => {
            _.map(splitters, function (splitter) {
                PMS.globals.splitters.add({
                    e_splitter: splitter.resource_uri,
                    expense: expense_id,
                    owes: parseInt(splitter.amount),
                });
                PMS.globals.splitters.last().save(null, {
                    success: function () {
                        if (counter >= splitters.length - 1) {
                            resolve();
                        }
                        counter++;
                    },
                    error: function (err) {
                        reject(err);
                    },
                });
            })

        })



    },
     
    getAllGroupMembers: function () {
        return fetch('https://expenser-app-django-heroku.herokuapp.com/group_friend/', {
            method: "GET",
            headers: PMS.fn.getAuthHeaders(),
        })

    },
    getCurrentGroupId: function () {
        return parseInt(Backbone.history.location.hash.split("/")[1]);
    },
    getGroupMembers: function () {
        return fetch(`https://expenser-app-django-heroku.herokuapp.com/group_friend/`, {
            method: "GET",
            headers: PMS.fn.getAuthHeaders(),
        });
    },
    removeGroupMember: function (profile_friend_id) {

        return fetch(`https://expenser-app-django-heroku.herokuapp.com/group_friend/${profile_friend_id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),

        })
    },
    getCurrentGroupFriends: function (current_group_id = parseInt(Backbone.history.location.hash.split("/")[1])) {
        return PMS.groupsCollection.where({ id: current_group_id })[0].get('group_friends')
    },
    getProfile: function () {
        fetch(`https://expenser-app-django-heroku.herokuapp.com/profile/`, {
            method: "GET",
            headers: getAuthHeaders(),
        })
    },
    

}