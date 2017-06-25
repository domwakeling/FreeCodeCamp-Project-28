import { Meteor } from 'meteor/meteor';
import '/imports/api/stocks.js';
import '/imports/api/quandl.js';
import '/imports/api/wiki.js';

Meteor.startup(() => {
    // At server startup, ensure we have a list of all the wiki entries
    Meteor.call('wiki.ensureWikiIndexExists');

});
