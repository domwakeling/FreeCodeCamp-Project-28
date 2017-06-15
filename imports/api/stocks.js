import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Stocks = new Mongo.Collection('stocks');

// if (Meteor.isServer) {
//   // This code only runs on the server
//   Meteor.publish('votes', function tasksPublication() {
//     return Votes.find();
//   });
// }

Meteor.methods({

    // 'votes.howMany'(businessId) {
    //     var result = Votes.findOne({businessId: businessId});
    //     if (result && result.going) {
    //         return result.going.length;
    //     } else {
    //         return 0;
    //     }
    // },
    //
    // 'votes.isGoing'(businessId, userId) {
    //     var result = Votes.findOne({businessId: businessId});
    //     if (result && result.going) {
    //         return result.going.indexOf(userId) >= 0;
    //     } else {
    //         return false;
    //     }
    // },
    //
    'stocks.addOne'(ticker) {
        Stocks.insert(
            {ticker: ticker},
        );
    }

    // 'votes.removeOne'(businessId, userId) {
    //     Votes.update(
    //         {businessId: businessId},
    //         {$pull: {going: userId}},
    //     );
    // }

});
