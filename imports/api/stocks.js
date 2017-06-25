import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Bert } from 'meteor/themeteorchef:bert';

/*  Stocks are stored as documents with:
 *  - key ticker to their ticker shortcode
 *  - key lastUpdated storing the date() this was last upserted
 *  - key closeValues storing the values timeline from previous year
 *  - key closeDates storing the dates associated with the closeValues
 *  - key type with a value 'stock'
 */

export const Stocks = new Mongo.Collection('stocks');

// if (Meteor.isServer) {
//   // This code only runs on the server
//   Meteor.publish('stocks', function tasksPublication() {
//     return Stocks.find();
//   });
// }

Meteor.methods({

    async 'stocks.upsert'(ticker) {
        Meteor.call('quandl.getStockHistory', ticker, function(err, res) {
            if (err && Meteor.isServer) {
                console.log('ERROR:', err);
            } else if (Meteor.isServer) {
                const dateArray = res.datatable.data.map((arr) => arr[0]);
                const valsArray = res.datatable.data.map((arr) => arr[1]);
                Stocks.update(
                    {ticker: ticker},
                    {$set: {
                        lastUpdated: new Date(),
                        closeValues: valsArray,
                        closeDates: dateArray,
                        type: 'stock'
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
