import React from 'react';
// import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

export default class Submit extends React.Component {

    constructor(props) {
        super(props);
        // this.handleChange = this.handleChange.bind(this);
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
            Meteor.call('stocks.addOne', stockCode);
        }
    }

    // handleChange() {
    //     const stockCode = $('input[name=search]')[0].value;
    //     this.props.changeCallback(stockCode);
    // }

    render() {
        return (
            <div>
                <div className='space-top' />
                <h2 className='text-centre'>See where's hot near you</h2>
                <form className='searchbox-form'>
                    <div className='field field-is-search'>
                        <input
                            className='searchbox-text'
                            name='search'
                            // onChange={this.handleChange}
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

// Submit.propTypes = {
    // changeCallback: PropTypes.func,
    // stockCode: PropTypes.string,
    // submitCallback: PropTypes.func
// };
