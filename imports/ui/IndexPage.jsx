import React from 'react';
import PropTypes from 'prop-types';
import Layout from './components/Layout.jsx';
import { createContainer } from 'meteor/react-meteor-data';
// import { Meteor } from 'meteor/meteor';
import { Stocks } from '/imports/api/stocks.js';
import Submit from './components/Submit.jsx';
import StockBox from './components/Stock.jsx';
// import Search from './components/Search.jsx';
// import { Session } from 'meteor/session';
// import { Bert } from 'meteor/themeteorchef:bert';
// import Bars from './components/Bars.jsx';

// Main index page
class IndexPage extends React.Component {

    constructor(props) {
        super(props);
    }

    // componentWillMount() {
    //     // ensureCurrentQuandlWiki();
    //     Meteor.call('stocks.ensureQuandlWikiExists');
    // }

    renderCollection() {
        return this.props.stocks.map((entry, idx) => (
            <StockBox displayName={entry.ticker} key={idx} />
        ));
    }

    render() {
        return (
            <Layout>
                <h4>Just to stop the props whinging</h4>
                <Submit />
                {this.renderCollection()}
            </Layout>
        );
    }

}

// Utility function to ensure there is a current quandlWiki in our dbase
// async function ensureCurrentQuandlWiki() {
//     console.log('Starting function');
//     Meteor.call('stocks.quandlWikiLastUpdated', function(err, date) {
//         console.log('Received date', date);
//         if (err) {
//             console.log('ERROR:', err);
//         } else if (!date || date.error) {
//         // if (!date || date.error) {
//             console.log(date);
//             // our 'date' is actually an error
//             upsertQuandlWiki();
//         } else {
//             console.log('Found a real date:', date);
//         }
//     });
// }

// async function upsertQuandlWiki() {
//     console.log('Getting Quandl Wiki dataset');
//     Meteor.call('quandl.getWikiKeys', function(err, res) {
//         if (err) {
//             console.log('ERROR:', err);
//         } else {
//             console.log('Processing dataset');
//             const dataArray = res.datatable.data.map((arr) => arr[0]);
//             Meteor.call('stocks.upsertWiki', dataArray, function(err, res) {
//                 if (err) {
//                     console.log('ERROR upserting:', err);
//                 } else {
//                     console.log('Dataset stored succesfully');
//                 }
//             });
//         }
//     });
// }

// Define props types, error checking and prevents eslint error reports
IndexPage.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    stocks: PropTypes.array
};

// Wrap the component in a createContainer component, so data can be rendered
export default createContainer(() => {
    return {
        stocks: Stocks.find({type: 'stock'}).fetch()
    };
}, IndexPage);
