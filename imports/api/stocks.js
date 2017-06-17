import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

/*  Stocks are stored as documents with:
 *  - key ticker to their ticker shortcode
 *  - key lastUpdated storing the date() this was last upserted
 *  - key timeline storing the values timeline from previous year
 *  - key type with a value 'stock'
 *
 *  There is also a document with type 'wikiIndex' which stores all possible
 *  keys in the WIKI set at Quandl; this also has a lastUpdated value such
 *  that we know how old it is
 */

export const Stocks = new Mongo.Collection('stocks');

// if (Meteor.isServer) {
//   // This code only runs on the server
//   Meteor.publish('stocks', function tasksPublication() {
//     return Stocks.find();
//   });
// }

Meteor.methods({

    'stocks.upsert'(ticker, stockHistory) {
        Stocks.update(
            {ticker: ticker},
            {$set: {
                lastUpdated: new Date(),
                timeline: stockHistory,
                type: 'stock'
                }
            },
            {upsert: true}
        );
    },

    'stocks.delete'(ticker) {
        Stocks.remove(
            {ticker: ticker},
        );
    },

    'stocks.ensureQuandlWikiExists'() {

        // get the dataset as stored (or 'undefined')
        const quandlWiki = Stocks.find(
            {type: 'wikiIndex'}
        ).fetch();

        // if dataset exists, it'll be at start of resulting array
        if (!quandlWiki[0]) {
            // so if not, collect the data and store it
            Meteor.call('quandl.getWikiKeys', function(err, res) {
                if (err) {
                    console.log('ERROR:', err);
                } else {
                    console.log('Processing dataset');
                    const dataArray = res.datatable.data.map((arr) => arr[0]);
                    Stocks.update(
                        {type: 'wikiIndex'},
                        {$set: {
                            tickerList: dataArray
                            }
                        },
                        {upsert: true}
                    );
                    console.log('Dataset processed and stored');
                }
            });
        }
    }

});
