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
                <button
                    className='stockbox-cancel'
                    onClick={this.boundCancelClicked}
                    >
                    &times;
                </button>
                <h5 className='stockbox-name'>{this.props.displayName}</h5>
                <p className='stockbox-detail'>{this.props.displayText}</p>
            </div>
        );
    }
}

StockBox.propTypes = {
    displayName: PropTypes.string,
    displayText: PropTypes.string
};
