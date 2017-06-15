// This file provides server-side API calls using settings which are private
// (ie only on the server / not declared as public)
//
// In order to use this, ensure that 'http' package is installed in Meteor
// (can be installed with 'meteor add http')
//
// This file should then be included in the server-side 'main.js' file

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

var apiCallGet = function(apiUrl, authToken, callback) {
    try {
        var options = { headers: { Authorization: 'Bearer ' + authToken } };
        var response = HTTP.call('GET', apiUrl, options).data;
        callback(null, response);
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
        callback(myError, null);
    }
};

var apiCallPost = function(apiUrl, callback) {
    try {
        var response = HTTP.post(apiUrl).data;
        callback(null, response);
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
        callback(myError, null);
    }
};

Meteor.methods({

    'yelp.getAuthToken'() {

        return new Promise(function(resolve, reject) {

            // Construct the API URL
            const clientId = Meteor.settings.yelpClientId;
            const clientSecret = Meteor.settings.yelpClientSecret;
            var apiUrl = 'https://api.yelp.com/oauth2/token';
            apiUrl = apiUrl + '?grant-type=client_credentials';
            apiUrl = apiUrl + '&client_id=' + clientId;
            apiUrl = apiUrl + '&client_secret=' + clientSecret;

            var response = Meteor.wrapAsync(apiCallPost)(apiUrl);
            resolve(response);
            // next line ONLY here to prevent a linting error
            reject(response);

        });
    },

    'yelp.getLocalInfo'(authToken, location) {

        return new Promise(function(resolve, reject) {

            // Construct the API URL
            var apiUrl = 'https://api.yelp.com/v3/businesses/search';
            apiUrl = apiUrl + '?term=bar';
            apiUrl = apiUrl + '&location=' + location;

            var response = Meteor.wrapAsync(apiCallGet)(apiUrl, authToken);
            resolve(response);
            // next line ONLY here to prevent a linting error
            reject(response);

        });
    },

    'yelp.getBusinessInfo'(authToken, location) {

        return new Promise(function(resolve, reject) {

            // Construct the API URL
            var apiUrl = 'https://api.yelp.com/v3/businesses/search';
            apiUrl = apiUrl + '?term=bar';
            apiUrl = apiUrl + '&location=' + location;

            var response = Meteor.wrapAsync(apiCallGet)(apiUrl, authToken);
            resolve(response);
            // next line ONLY here to prevent a linting error
            reject(response);

        });
    }

});
