import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

export default class Submit extends React.Component {

    constructor(props) {
        super(props);
        this.submitStock = this.submitStock.bind(this);
        this.checkTickerExists = this.checkTickerExists.bind(this);
    }

    async submitStock(e) {
        e.preventDefault();
        $('#searchbutton').blur();
        const stockCode = $('input[name=search]')[0].value;
        if (stockCode === '') {
            Bert.alert({
                title: 'No stock provided',
                type: 'danger',
                message: 'Please provide a stock code!',
                style: 'growl-top-right',
                icon: 'fa-warning'
            });
        } else {
            this.checkTickerExists(stockCode).then(function(res) {
                if (res) {
                    Meteor.call('stocks.upsert', stockCode, 'Whatever');
                } else {
                    Bert.alert({
                        title: 'Stock not recognised',
                        type: 'danger',
                        message: stockCode + '  is not a valid ticker!',
                        style: 'growl-top-right',
                        icon: 'fa-warning'
                    });
                }
            }, function(err) {
                console.log('ERROR:', err);
            });
        }
    }

    async checkTickerExists(ticker) {
        return new Promise( function(resolve, reject) {
            Meteor.call('stocks.checkTickerExists', ticker, function(err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    render() {
        return (
            <div>
                <div className='space-top' />
                <h2 className='text-centre'>Enter a stock code</h2>
                <form className='searchbox-form'>
                    <div className='field field-is-search'>
                        <input
                            className='searchbox-text'
                            name='search'
                            placeholder='What stock are you interested in?'
                            type='search'
                        />

                        <button
                            className='searchbox-button'
                            id='searchbutton'
                            onClick={this.submitStock}
                            type='submit'
                            >Search
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}
