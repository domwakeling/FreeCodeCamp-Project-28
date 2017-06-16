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

    'stocks.upsert'(ticker, stockHistory) {
        Stocks.update(
            {ticker: ticker},
            {$set: {
                lastUpdated: new Date(),
                timeline: stockHistory
                }
            },
            {upsert: true}
        );
    },

    'stocks.delete'(ticker) {
        Stocks.remove(
            {ticker: ticker},
        );
    }

});
