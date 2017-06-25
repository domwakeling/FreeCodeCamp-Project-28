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
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (this.props.stocks.length > 0) {
            return this.props.stocks[0].closeDates.map(function(date) {
                date = date.split('-');
                date = [date[2], months[parseInt(date[1] - 1, 10)], date[0]];
                return date.join(' ');
            });
        } else {
            return [];
        }
    }

    render() {

        this.ensureAllStocksUpdated();

        const colors = ['rgba(120,194,30,1.0)', 'rgba(0,95,139,1.0)',
                        'rgba(242,150,38,1.0)'];

        const labels = this.getStockClosedDates();

        var data = {
            labels: labels,
            datasets: this.props.stocks.map(function(stock, idxS) {
                return {
                    data: stock.closeValues.map(function(val, idx, values) {
                        return ((val / values[0] - 1) * 100).toFixed(2);
                    }),
                    label: stock.ticker,
                    fill: false,
                    borderDash: [2 * Math.floor(idxS / colors.length)],
                    pointStyle: 'line',
                    backgroundColor: 'rgba(220,220,220,0.0)',
                    borderColor: colors[idxS % colors.length]
                };
            })
        };
        var options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false,
                        callback: function(value) {
                            return '' + value.toFixed(0) + '%';
                        }
                    }
                }],
                tooltips: {
                    callbacks: {
                        // yLabel: function(value) {
                        //     return '' + (value * 100).toFixed(1) + '%';
                        // }
                        label: function(tooltipItem, data) {
        var label = data.labels[tooltipItem.index];
        // var datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
        // return label + ': ' + datasetLabel + '%';
        return label;
      }
                    }
                }
            }
        };
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
