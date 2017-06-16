import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

export default class Submit extends React.Component {

    constructor(props) {
        super(props);
        this.submitStock = this.submitStock.bind(this);
    }

    submitStock(e) {
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
            Meteor.call('stocks.upsert', stockCode, 'Whatever');
        }
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
