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
    saveGroupMember: function (added_friend, removed_friend, group_id) {
        var add_requests = [];
        var remove_requests = [];
        var group = `/group/${group_id}/`;
        var self = this;
        _.map(added_friend, function (member) {

            add_requests.push(fetch(`https://expenser-app-django-heroku.herokuapp.com/group_friend/`, {
                method: "POST",
                headers: PMS.fn.getAuthHeaders(),
                body: JSON.stringify({
                    friend: member.resource_uri,
                    group: group,
                })
            }))





        });
        _.map(removed_friend, function (member) {
            remove_requests.push(
                fetch(`https://expenser-app-django-heroku.herokuapp.com${member.resource_uri}`, {
                    method: "DELETE",
                    headers: PMS.fn.getAuthHeaders(),

                })
            )
        })
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
    getAllGroupBalances: function () {
        var all_group_balance = [];
        PMS.groupsCollection.map(function (_group) {
            var members = [];
            PMS.fn.getSpecificGroupFriend(_group.attributes.resource_uri).map((friend) => members.push({ username: friend.friend.user.username, profile_friend: friend.friend.resource_uri, accounts: [] }));

            //Populating members structure
            _.map(PMS.globals.expenses.where({group : _group.attributes.resource_uri}), function (expense) {
                //console.log(expense.attributes.splitters);     
                _.map(members, function (member) {
                    console.log(expense);
                    if (expense.attributes.payer.friend.resource_uri !== member.profile_friend) {
                        _.map(expense.attributes.splitters, function (splitter) {
                            //console.log(`${splitter.e_splitter.friend.user.username} owes ${splitter.owes} to ${expense.attributes.payer.friend.user.username}`);

                            if (member.profile_friend === splitter.e_splitter.friend.resource_uri) {
                                //checking if this expense is already settled by the user or not

                                if (!_.contains(expense.attributes.settled_by,PMS.fn.getSpecificGroupFriend(_group.attributes.resource_uri).find((friend) => friend.friend.resource_uri === member.profile_friend).resource_uri)) {
                                    let ref = member.accounts.find((acc) => acc.profile_friend === expense.attributes.payer.friend.resource_uri);
                                    if (ref) {
                                        ref.amount = ref.amount + splitter.owes;
                                    }
                                    else {
                                        console.log('desired', expense.attributes.payer.friend.resource_uri);
                                        member.accounts = [...member.accounts, {
                                            username: expense.attributes.payer.friend.user.username,
                                            profile_friend: expense.attributes.payer.friend.resource_uri,
                                            amount: splitter.owes
                                        }]
                                    }
                                }

                            }



                        });
                    }
                });

            });

            console.log('member_array', members);
            //Eliminating due amounts in inter-account context 
            _.map(members, function (member) {
                let otherMembers = members.filter((_member) => _member.profile_friend !== member.profile_friend);
                _.map(member.accounts, function (account) {
                    _.map(otherMembers, function (otherMember) {
                        if (otherMember.profile_friend == account.profile_friend) {
                            _.map(otherMember.accounts, function (oMemAccount) {
                                if (oMemAccount.profile_friend == member.profile_friend) {
                                    if (account.amount > oMemAccount.amount) {
                                        console.log(` ${account.amount} = ${account.amount}- ${oMemAccount.amount}`)
                                        account.amount = account.amount - oMemAccount.amount;
                                        oMemAccount.amount = 0;
                                    }
                                    else {
                                        oMemAccount.amount = oMemAccount.amount - account.amount;
                                        console.log(` ${oMemAccount.amount} = ${oMemAccount.amount}- ${account.amount}`)

                                        account.amount = 0;

                                    }
                                }
                            })
                        }
                    })
                })
            });

           var transactions = [];

            members.map((member) => {
                //console.log(`${member.username} === ${localStorage.getItem('expenser-username')}`)
                member.accounts.map((account) => {
                    if (account.amount > 0 && (member.username === localStorage.getItem('expenser-username') || account.username === localStorage.getItem('expenser-username'))) {
                       transactions.push({
                            ower: member.username,
                            lender: account.username,
                            lender_profile: account.profile_friend,
                            amount: account.amount,
                        });
                    }

                    console.log(`${member.username} owes ${account.amount} to ${account.username}`)
                })


            });

            all_group_balance.push({
                group_id: _group.attributes.resource_uri,
                group_name: _group.attributes.name,
                balances: transactions,
            })

        })
        console.log('all_group_balance');
        console.log(all_group_balance);
        return all_group_balance;
    },
    renderGroupBalance: function () {
        PMS.GroupBalanceData = {};
        PMS.LoadGroupBalance();
        PMS.GroupBalanceData.members = [];
        PMS.fn.getCurrentGroupFriends().map((friend) => PMS.GroupBalanceData.members.push({ username: friend.friend.user.username, profile_friend: friend.friend.resource_uri, accounts: [] }));

        //Populating members structure
        _.map(PMS.globals.expenses.where({ group: `/group/${PMS.fn.getCurrentGroupId()}/` }), function (expense) {
            //console.log(expense.attributes.splitters);     
            _.map(PMS.GroupBalanceData.members, function (member) {
                if (expense.attributes.payer.friend.resource_uri !== member.profile_friend) {
                    _.map(expense.attributes.splitters, function (splitter) {
                        //console.log(`${splitter.e_splitter.friend.user.username} owes ${splitter.owes} to ${expense.attributes.payer.friend.user.username}`);

                        if (member.profile_friend === splitter.e_splitter.friend.resource_uri) {
                            //checking if this expense is already settled by the user or not

                            if (!_.contains(expense.attributes.settled_by, PMS.fn.getCurrentGroupFriends().find((friend) => friend.friend.resource_uri === member.profile_friend).resource_uri)) {
                                let ref = member.accounts.find((acc) => acc.profile_friend === expense.attributes.payer.friend.resource_uri);
                                if (ref) {
                                    ref.amount = ref.amount + splitter.owes;
                                }
                                else {
                                    console.log('desired', expense.attributes.payer.friend.resource_uri);
                                    member.accounts = [...member.accounts, {
                                        username: expense.attributes.payer.friend.user.username,
                                        profile_friend: expense.attributes.payer.friend.resource_uri,
                                        amount: splitter.owes
                                    }]
                                }
                            }

                        }



                    });
                }
            });

        });

        console.log('member_array', PMS.GroupBalanceData.members);
        //Eliminating due amounts in inter-account context
        var ClonedMembers = PMS.GroupBalanceData.members;
        _.map(PMS.GroupBalanceData.members, function (member) {
            let otherMembers = PMS.GroupBalanceData.members.filter((_member) => _member.profile_friend !== member.profile_friend);
            _.map(member.accounts, function (account) {
                _.map(otherMembers, function (otherMember) {
                    if (otherMember.profile_friend == account.profile_friend) {
                        _.map(otherMember.accounts, function (oMemAccount) {
                            if (oMemAccount.profile_friend == member.profile_friend) {
                                if (account.amount > oMemAccount.amount) {
                                    console.log(` ${account.amount} = ${account.amount}- ${oMemAccount.amount}`)
                                    account.amount = account.amount - oMemAccount.amount;
                                    oMemAccount.amount = 0;
                                }
                                else {
                                    oMemAccount.amount = oMemAccount.amount - account.amount;
                                    console.log(` ${oMemAccount.amount} = ${oMemAccount.amount}- ${account.amount}`)

                                    account.amount = 0;

                                }
                            }
                        })
                    }
                })
            })
        });

        PMS.groupBalanceModel = new PMS.GroupBalanceModel({
            transactions: [

            ],
        });
        PMS.GroupBalanceData.members.map((member) => {
            //console.log(`${member.username} === ${localStorage.getItem('expenser-username')}`)
            member.accounts.map((account) => {
                if (account.amount > 0 && (member.username === localStorage.getItem('expenser-username') || account.username === localStorage.getItem('expenser-username'))) {
                    PMS.groupBalanceModel.attributes.transactions.push({
                        ower: member.username,
                        lender: account.username,
                        lender_profile: account.profile_friend,
                        amount: account.amount,
                    });
                }

                console.log(`${member.username} owes ${account.amount} to ${account.username}`)
            })


        });

        PMS.groupBalanceView = new PMS.GroupBalanceView({
            model: PMS.groupBalanceModel,
        }).render();


    },
    getSpecificGroupFriend : function(id)
    {
        return PMS.groupsCollection.where({ resource_uri: id })[0].get('group_friends');
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
    removeGroupMember: function (removed_friend, profile_friend_id) {

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