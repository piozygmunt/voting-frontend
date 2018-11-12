import React from "react";
import Route from 'react-router-dom/Route'
import Redirect from 'react-router-dom/Redirect'


export default class PrivateRoute extends React.Component {
    render() {
        const {component: Component, currentUser,...rest} = this.props;

        return (

            <Route {...rest} render={(props) => (
            this.props.currentUser!=null
                ? <Component currentUser={currentUser} {...props} />
                : <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
            )}/>)
    }
}
