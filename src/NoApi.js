import React from 'react';
import ReactDOM from 'react-dom/client';

// show this when the api is not available
class NoApi extends React.Component {
    render() {
        // error 503: service unavailable
        return (
        <div className="noapi">
            <h1>Error 503 - Service unavailable</h1>
            <p>The API is not available. Please try again later.</p>
            <p>Expected API address: {this.props.apiAddress}</p>
        </div>
        );
    }
    }

export default NoApi;
