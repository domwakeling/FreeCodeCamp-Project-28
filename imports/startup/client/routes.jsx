import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import IndexPage from '/imports/ui/IndexPage.jsx';

Meteor.startup( () => {
    render(
        <BrowserRouter>
            <Route component={IndexPage} path='/' />
        </BrowserRouter>,
        document.getElementById('render-target')
    );
});
