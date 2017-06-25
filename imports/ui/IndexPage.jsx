import React from 'react';
import PropTypes from 'prop-types';
import Layout from './components/Layout.jsx';
import { createContainer } from 'meteor/react-meteor-data';
import { Stocks } from '/imports/api/stocks.js';
import { Meteor } from 'meteor/meteor';
import StockChart from './components/StockChart.jsx';
import Submit from './components/Submit.jsx';
import StockBox from './components/Stock.jsx';

// Main index page
class IndexPage extends React.Component {

    constructor(props) {
        super(props);
    }

    renderCollection() {
        return this.props.stocks.map((entry, idx) => (
            <StockBox
                displayName={entry.ticker}
                displayText={entry.text}
                key={idx}
            />
        ));
    }

    render() {
        const chartWidth = $('#chartContainer').width();
        return (
            <Layout>
                <div id='chartContainer'>
                    <StockChart cWidth={chartWidth}/>
                </div>
                <Submit />
                <div className='stockbox-container'>
                    <div className='stockbox-flex'>
                        {this.renderCollection()}
                    </div>
                </div>
            </Layout>
        );
    }

}

// Define props types, error checking and prevents eslint error reports
IndexPage.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    stocks: PropTypes.array
};

// Wrap the component in a createContainer component, so data can be rendered
export default createContainer(() => {
    Meteor.subscribe('stocks');
    return {
        stocks: Stocks.find({}).fetch()
    };
}, IndexPage);
