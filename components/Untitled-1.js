var all_group_balance = [];
PMS.groupsCollection.models.map(function (_group) {
    var members = [];
    PMS.fn.getCurrentGroupFriends().map((friend) => members.push({ username: friend.friend.user.username, profile_friend: friend.friend.resource_uri, accounts: [] }));

    //Populating members structure
    _.map(PMS.globals.expenses.where({ group: _group.attributes.resource_uri }), function (expense) {
        //console.log(expense.attributes.splitters);     
        _.map(members, function (member) {
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

    PMS.groupBalanceModel = new PMS.GroupBalanceModel({
        transactions: [

        ],
    });

    members.map((member) => {
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

    all_group_balance.push({
        group_id: _group.attributes.resource_uri,
        balances :   PMS.groupBalanceModel.attributes.transactions,
    })

})
console.log('all_group_balance');
console.log(all_group_balance);
