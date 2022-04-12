PMS.globals.expenses.models.map((expense) => {
    expense.attributes.splitters.map((splitter) => {
        if (splitter.e_splitter.friend.user.username === PMS.fn.getUsername() && expense.attributes.payer.friend.user.username !== PMS.fn.getUsername()) {
            console.log(`${splitter.e_splitter.friend.user.username} owes ${splitter.owes} ${expense.attributes.payer.friend.user.username}`)
            console.log(`${splitter.e_splitter.resource_uri} owes ${splitter.owes} ${expense.attributes.payer.resource_uri} in ${expense.attributes.resource_uri}`);
            if (!_.contains(expense.attributes.payer.friend.profile, expense.attributes.settled_by)) {
                expense.attributes.settled_by.push(PMS.globals.profile.attributes.resource_uri);
                expense.save();
            }
        }
    })

});
