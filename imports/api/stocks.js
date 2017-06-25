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
        var textToUse = '';
        if (text !== '') {
            const idx = text.indexOf('(' + ticker);
            textToUse = idx > 0 ? text.substr(0, idx) : 'No description';
        }
        // var textToUse = text
        Meteor.call('quandl.getStockHistory', ticker, function(err, res) {
            if (err && Meteor.isServer) {
                console.log('ERROR:', err);
            } else if (Meteor.isServer) {
                const dateArray = res.datatable.data.map((arr) => arr[0]);
                const valsArray = res.datatable.data.map((arr) => arr[1]);
                var updateSet = {
                    lastUpdated: new Date(),
                    closeValues: valsArray,
                    closeDates: dateArray
                };
                if (textToUse !== '') {
                    updateSet['text'] = textToUse;
                }
                Stocks.update(
                    {ticker: ticker},
                    {$set: updateSet},
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
            if (selected.length === 0) {
                const errorCode = 999;
                const errorMessage = 'Ticker not found in index';
                var myError = new Meteor.Error(errorCode, errorMessage);
                reject(myError);
            } else {
                console.log('Starting to resolve in callback');
                resolve(selected[0]['text']);
            }

        });
    }

});
