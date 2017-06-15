import React from 'react';
import MenuItems from './Menu.jsx';

export default class Navbar extends React.Component {

    // Handler for when the hamburger is clicked
    clickHandler() {
        $('.navbar-collapse').slideToggle(200);
        $('.menu-toggle-button').blur();
    }

    // Full width navbar, content in a div.container which CSS matches to
    // screen width, include a brand + hamburger for small screens and two
    // copies of the menu items (one for plain and one for hamburger). The
    // div.head-space is just a spacer between navbar and content
    render() {
        return (
            <div>
                <div className='mast-head'>

                    <div className='container'>
                        <div className='brand'>
                            <a href='/'>FCC27 Nightlife App</a>
                        </div>

                        <button
                            className='menu-toggle-button'
                            onClick={this.clickHandler.bind(this)}
                            >
                            <div className='bar-icon' />
                            <div className='bar-icon' />
                            <div className='bar-icon' />
                        </button>

                        <div className='navbar-top-menu' id='navbar-top-menu'>
                            <MenuItems />
                        </div>

                    </div>

                    <div className='navbar-collapse' id='navbar-toggle-menu'>

                        <div className='container' id='menu-copy'>
                            <MenuItems />
                        </div>

                    </div>

                </div>

                <div id='head-space' />
            </div>
        );
    }
}
