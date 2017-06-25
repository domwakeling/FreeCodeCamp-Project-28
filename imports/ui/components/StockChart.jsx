import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Line } from 'react-chartjs-2';
import { Stocks } from '/imports/api/stocks.js';
import { createContainer } from 'meteor/react-meteor-data';

class StockChart extends React.Component {

    constructor(props) {
        super(props);
        this.ensureAllStocksUpdated = this.ensureAllStocksUpdated.bind(this);
        this.getStockClosedDates = this.getStockClosedDates.bind(this);
        this.getStockDataSets = this.getStockDataSets.bind(this);
    }

    // check if stocks were updated in last 12 hours
    ensureAllStocksUpdated() {
        const currDate = new Date();
        if (this.props.stocks.length > 0) {
            this.props.stocks.forEach(function(stock) {
                const lastDate = new Date(stock.lastUpdated);
                if ((currDate - lastDate) > (12 * 60 * 60 * 1000)) {
                    const ticker = stock.ticker;
                    Meteor.call('stocks.upsert', ticker, '');
                }
            });
        }
    }

    // get the close dates of first stock, to use as labels
    getStockClosedDates() {
        if (this.props.stocks.length > 0) {
            console.log(this.props.stocks[0].closeDates);
            return this.props.stocks[0].closeDates;
        } else {
            return [];
        }
    }

    // get the datasets ...
    getStockDataSets() {
        var ret = [];
        this.props.stocks.forEach(function(stock) {
            var temp = {label: stock.ticker};
            temp['data'] = stock.closeValues;
            ret.push(temp);
        });
        console.log(ret);
        return ret;
    }

    render() {

        this.ensureAllStocksUpdated();
        // var boundGetStockDataSets = this.getStockDataSets.bind(this);

        const labels = this.getStockClosedDates();
        // const datasets = this.getStockDataSets();

        var data = {
            labels: labels,
            datasets: this.props.stocks.map(function(stock) {
                return {data: stock.closeValues, label: stock.ticker};
            })
                // data: this.props.stocks.map((stock) => {
                //     return stock.closeValues;
                // })
                // labels: this.props.stocks.map((stock) => {
                //     return stock.ticker;
                // })
            // }]
            // labels: ['Red', 'Blue', 'Green'],
            // datasets: {datasets}
            // datasets: {boundGetStockDataSets}
            // datasets: [{label: 'sommet', data: [1, 2, 3]}]
            // datasets: [{
            //     label: '# of Votes',
            //     data: [12, 19, 13, 15, 12, 13],
            //     strokeColor: 'rgba(220,220,220,1)',
            //     fillColor: [
            //     'rgba(0, 95, 139, 0.0)'
            //     ]
            // },
            // {
            //     label: '# of Votes',
            //     data: [10, 14, 16, 17, 18, 11],
            //     strokeColor: 'rgba(220,0,220,1)'
            //     // fillColor: [
            //     // 'rgba(0, 95, 139, 0.5)'
            //     // ]
            // }]
        };
        var options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            }
        };
        console.log(data);
            return (
                <Line
                        data={data}
                        height={300}
                        options={options}
                        width={400}
                />
                );
    }

}

StockChart.propTypes = {
    cWidth: PropTypes.number,
    labels: PropTypes.array,
    scores: PropTypes.array,
    stocks: PropTypes.array
};

// Wrap the component in a createContainer component, so data can be rendered
export default createContainer(() => {
    return {
        stocks: Stocks.find({}).fetch()
    };
}, StockChart);
