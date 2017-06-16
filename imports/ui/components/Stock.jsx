import React from 'react';
import PropTypes from 'prop-types';
import { Meteor} from 'meteor/meteor';

export default class StockBox extends React.Component {

    cancelClicked() {
        const stockTicker = this.props.displayName;
        Meteor.call('stocks.delete', stockTicker);
    }

    render() {
        this.boundCancelClicked = this.cancelClicked.bind(this);
        return (
            <div className='stockbox'>
                <p>{this.props.displayName}</p>
                <button
                    className='round-button btn-cancel'
                    onClick={this.boundCancelClicked}
                    >
                    &times;
                </button>
            </div>
        );
    }
}

StockBox.propTypes = {
    displayName: PropTypes.string
};
