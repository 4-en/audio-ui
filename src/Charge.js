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
        const user = this.props.app.state.user;
        if (user === null) {
            this.props.app.redirect("/store");
            return;
        }

        const sid = user.session_id;

        const resp = await this.props.app.apiRequest("/charge", "POST", { amount: amount, session_id: sid });
        const data = await resp.json();
        if (resp.status === 200) {
            this.props.app.redirect("/store");
        } else {
            console.log(data);
            this.props.app.redirect("/store");
        }
        
        
    }

    render() {
        return (
            <div className="chargeContainer">
                <h2>Recharge your balance</h2>
                <div className="chargeButtonContainer">
                    <button className="chargeButton" onClick={async () => { await this.charge(1000); }}>10€</button>
                    <button className="chargeButton" onClick={async () => { await this.charge(2000); }}>20€</button>
                    <button className="chargeButton" onClick={async () => { await this.charge(5000); }}>50€</button>
                    <button className="chargeButton" onClick={async () => { await this.charge(10000); }}>100€</button>
                </div>
            </div>
        );
    }
}

export default Charge;