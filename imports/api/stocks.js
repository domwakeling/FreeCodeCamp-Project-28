import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { WikiCodes} from './wiki.js';

/*  Stocks are stored as documents with:
 *  - key ticker to their ticker shortcode
 *  - key lastUpdated storing the date() this was last upserted
 *  - key closeValues storing the values timeline from previous year
 *  - key closeDates storing the dates associated with the closeValues
 */

export const Stocks = new Mongo.Collection('stocks');

// if (Meteor.isServer) {
//   // This code only runs on the server
//   Meteor.publish('stocks', function tasksPublication() {
//     return Stocks.find();
//   });
// }

Meteor.methods({

    async 'stocks.upsert'(ticker, text) {
        const idx = text.indexOf('(' + ticker);
        const textToUse = idx > 0 ? text.substr(0, idx) : 'No description';
        // var textToUse = text
        Meteor.call('quandl.getStockHistory', ticker, function(err, res) {
            if (err && Meteor.isServer) {
                console.log('ERROR:', err);
            } else if (Meteor.isServer) {
                const dateArray = res.datatable.data.map((arr) => arr[0]);
                const valsArray = res.datatable.data.map((arr) => arr[1]);
                Stocks.update(
                    {ticker: ticker},
                    {$set: {
                        text: textToUse,
                        lastUpdated: new Date(),
                        closeValues: valsArray,
                        closeDates: dateArray
                        // type: 'stock'
                        }
                    },
                    {upsert: true}
                );
            }
        });
    },

    'stocks.delete'(ticker) {
        Stocks.remove(
            {ticker: ticker},
        );
    },

    async 'stocks.checkTickerExists'(ticker) {

        return new Promise( function(resolve, reject) {

            const wikiTicker = 'WIKI/' + ticker;

            const selected = WikiCodes.find({ticker: wikiTicker}).fetch();

            // if ticker exists, it'll be at start (and only element) of array
            if (!selected || !selected[0]) {
                reject();
            } else {
                resolve(selected[0]['text']);
            }

        });
    }

});
