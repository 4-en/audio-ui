import React from 'react';
import { Link } from 'react-router-dom';
import './Charge.css';
import './library.css';


class Charge extends React.Component {
    constructor(props) {
        super(props);
    }

    async charge(amount) {
        // charge user balance


        alert("Charged " + amount + "€");
        this.props.app.redirect("/store");
    }

    render() {
        return (
            <div className="chargeContainer">
                <h2>Recharge your balance</h2>
                <div className="chargeButtonContainer">
                    <button className="chargeButton" onClick={async () => { await this.charge(10); }}>10€</button>
                    <button className="chargeButton" onClick={async () => { await this.charge(20); }}>20€</button>
                    <button className="chargeButton" onClick={async () => { await this.charge(50); }}>50€</button>
                    <button className="chargeButton" onClick={async () => { await this.charge(100); }}>100€</button>
                </div>
            </div>
        );
    }
}

export default Charge;