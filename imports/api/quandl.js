// This file provides server-side API calls using settings which are private
// (ie only on the server / not declared as public)
//
// In order to use this, ensure that 'http' package is installed in Meteor
// (can be installed with 'meteor add http')
//
// This file should then be included in the server-side 'main.js' file

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

async function apiCallGet(apiUrl) {

    return new Promise( function(resolve, reject) {

        try {
            var response = HTTP.call('GET', apiUrl).data;
            resolve(response);
        } catch (error) {
            console.log(error.data);
            var errorCode, errorMessage = '';
            if (error.response) {
                errorCode = error.response.data.code;
                errorMessage = error.response.data.message;
            // Otherwise use a generic error message
            } else {
                errorCode = 500;
                errorMessage = 'Cannot access the API';
            }
            // Create an Error object and return it via callback
            var myError = new Meteor.Error(errorCode, errorMessage);
            reject(myError);
        }

    });
}

Meteor.methods({

    'quandl.getWikiKeys'() {

        return new Promise(function(resolve, reject) {

            // Construct the API URL
            const quandlKey = '&api_key=' + Meteor.settings.quandlKey;
            const baseUrl = 'https://www.quandl.com/api/v3/datatables/';
            const dataset = 'WIKI/PRICES.json';
            const cols = '?qopts.columns=ticker&date=20160912';
            var apiUrl = baseUrl + dataset + cols + quandlKey;

            // var response = Meteor.wrapAsync(apiCallGet)(apiUrl);
            var response = apiCallGet(apiUrl);
            console.log('response is:', response);
            resolve(response);
            // next line ONLY here to prevent a linting error
            reject(response);

        });
    },

    'quandl.getStockHistory'(ticker) {

        return new Promise(function(resolve, reject) {

            // get date info to be able to sort through the last year
            const today = new Date();
            const currYear = today.getFullYear();
            let currMonth = today.getMonth() + 1;
            let currDay = today.getDate();
            if (currMonth < 10) {
                currMonth = '' + '0' + currMonth;
            }
            if (currDay < 10) {
                currDay = '' + '0' + currDay;
            }

            // Construct the API URL
            const baseUrl = 'https://www.quandl.com/api/v3/datatables/';
            const dataset = 'WIKI/PRICES.json';
            const dateGTE = '?date.gte=' + (currYear - 1) + currMonth + currDay;
            const dateLTE = '&date.lte=' + currYear + currMonth + currDay;
            const tickerQ = '&qopts.columns=date,close&ticker=' + ticker;
            const qKey = '&api_key=' + Meteor.settings.quandlKey;
            var apiUrl = baseUrl + dataset + dateGTE + dateLTE + tickerQ + qKey;
            console.log(apiUrl);

            var response = apiCallGet(apiUrl);
            console.log('response is:', response);
            resolve(response);
            // next line ONLY here to prevent a linting error
            reject(response);

        });
    }

});
