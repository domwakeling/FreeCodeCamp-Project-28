import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Bert } from 'meteor/themeteorchef:bert';

/*  Stocks are stored as documents with:
 *  - key ticker to their ticker shortcode
 *  - key lastUpdated storing the date() this was last upserted
 *  - key timeline storing the values timeline from previous year
 *  - key type with a value 'stock'
 *
 *  There is also a document with type 'wikiIndex' which stores all possible
 *  keys in the WIKI set at Quandl
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
    },

    'stocks.checkTickerExists'(ticker) {

        return new Promise( function(resolve, reject) {

            const wikiIndex = Stocks.find({type: 'wikiIndex'}).fetch();

            // if dataset exists, it'll be at start (and only element) of array
            if (!wikiIndex[0]) {
                // if no dataset, warn
                Bert.alert({
                    title: 'Error: Ticker list not loaded',
                    type: 'danger',
                    message: 'Please provide a stock code!',
                    style: 'growl-top-right',
                    icon: 'fa-warning'
                });
                const errorCode = 'ERROR';
                const errorMessage = 'No document of type wikiIndex';
                var myError = new Meteor.Error(errorCode, errorMessage);
                reject(myError);
            } else if (wikiIndex[0].tickerList.indexOf(ticker) >= 0) {
                resolve(true);
            } else {
                resolve(false);
            }

        });
    }

});
