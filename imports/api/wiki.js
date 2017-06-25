import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Papa } from 'meteor/harrison:papa-parse';

export const WikiCodes = new Mongo.Collection('wikicodes');

/*  The Wiki collection stores documents with a 'ticker' and a 'text' value;
 *  these are read from a csv that is stored in the /public directory, which
 *  was downloaded using https://www.quandl.com/api/v3/database/wiki/code
 */

Meteor.methods({

    async 'wiki.ensureWikiIndexExists'() {

        // get the length of the dataset as stored (or 'undefined')
        const numCodes = WikiCodes.find({}).count();

        // if dataset is empty, populate it ...
        if (!numCodes || numCodes === 0) {

            // so if not, collect the data and store it
            var fs = Npm.require('fs');
            const fp = '../../programs/web.browser/app/WIKI-datasets-codes.csv';
            fs.readFile(fp, 'utf8', function(err, data) {
                if (err) {
                    console.log('Error: ' + err);
                    return;
                } else {
                    console.log('Processing dataset');
                    wrapPapaParse(data).then(function(res) {
                        // resolve callback - format data and insert it
                        const dataArray = res.map((arr) => (
                            {ticker: arr[0], text: arr[1]}
                        ));
                        console.log('About to start insert');
                        dataArray.forEach((doc) => {WikiCodes.insert(doc); });
                        console.log('Dataset processed and stored');
                    },
                    function(err) {
                        console.log(err);
                    });
                }
            });
        }
    }
});

// async function wrapping up a Papa.parse to avoid non-Fiber issues
async function wrapPapaParse(data) {
    return new Promise( function(resolve, reject) {
        Papa.parse(data, {
            complete: function(result) {
                resolve(result.data);
            },
            error: function(result) {
                reject(result.error);
            }
        });
    });
}
