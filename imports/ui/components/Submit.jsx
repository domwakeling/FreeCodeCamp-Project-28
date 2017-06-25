import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

export default class Submit extends React.Component {

    constructor(props) {
        super(props);
        this.submitStock = this.submitStock.bind(this);
        this.checkTickerExists = this.checkTickerExists.bind(this);
    }

    // deal with stock being submitted
    async submitStock(e) {
        e.preventDefault();
        $('#searchbutton').blur();
        const stockCode = $('input[name=search]')[0].value.toUpperCase();

        // if no stock code, warn
        if (stockCode === '') {
            Bert.alert({
                title: 'No stock provided',
                type: 'danger',
                message: 'Please provide a stock code!',
                style: 'growl-top-right',
                icon: 'fa-warning'
            });
        } else {
            // check whether the stockCode is a valid ticker
            this.checkTickerExists(stockCode).then(
                // handle a resolved promise
                function(res) {
                    // resolved means ticker exists and returns the text for it
                    Meteor.call('stocks.upsert', stockCode, res);
                    // then set the search bar to default again
                    $('input[name=search]')[0].value = '';
                },
                // handle a rejected promise
                function() {
                    Bert.alert({
                        title: 'Stock not recognised',
                        type: 'danger',
                        message: stockCode + '  is not a valid ticker!',
                        style: 'growl-top-right',
                        icon: 'fa-warning'
                    });
                }
            );
        }
    }

    // helper function to abstract the returned promise and make 'then' work
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
