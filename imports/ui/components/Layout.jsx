import React from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import PropTypes from 'prop-types';

export default class Layout extends React.Component {
    // Render a generic layout with Navbar & Footer; the
    // div.container constains width dependent on screen size (CSS)
    render() {
        return (
            <div>
                <Navbar />
                <div className='container'>
                    {this.props.children}
                    <div className='clearfix' />
                    <Footer />
                </div>
            </div>
        );
    }
}

// Prevent eslint error report by declaring props
Layout.propTypes = {

    children: PropTypes.array
};
