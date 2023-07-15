import React from 'react';
import { Link, Navigate } from 'react-router-dom';

import './HomeComponents.css';


function formatDuration(duration) {
    let hours = Math.floor(duration / 3600);
    let minutes = Math.floor((duration - hours * 3600) / 60);
    let seconds = duration - hours * 3600 - minutes * 60;

    let formatted = "";
    if (hours > 0) {
        formatted += hours + "h ";
    }
    if (minutes > 0) {
        formatted += minutes + "m ";
    }
    if (hours === 0) {
        formatted += seconds + "s";
    }
    return formatted;
}


class LastPlayed extends React.Component {

    constructor(props) {
        super(props);

    }


    render() {

        if (!this.props.user || this.props.user === null) return (
            // login and register buttons
            <div className="log-reg-container">
                <h2>
                    Login or register to start listening!
                </h2>
                <div className="log-reg">
                    <Link className="log-reg-button al-button" to="/login">Login</Link>
                    <Link className="log-reg-button al-button" to="/register">Register</Link>
                </div>
            </div>

        );

        if (!this.props.lastPlayed || this.props.lastPlayed === null) return null;

        const lastPlayed = this.props.lastPlayed;

        const timeLeft = formatDuration(lastPlayed.duration - lastPlayed.progress);
        const url = "/static/covers/" + lastPlayed.cover_file;

        console.log(lastPlayed);
        const authorName = lastPlayed.author.first_name + " " + lastPlayed.author.last_name;

        const toUrl = "/library?play=" + lastPlayed.content_id;

        return (
            <div className="last-played-container">
                <h2>
                    Continue listening...
                </h2>
                <Link className="last-played" to={toUrl}>

                    <img className="last-played-image" src={url} />
                    <div className="last-played-details">
                        <div className="last-played-title">{lastPlayed.title}</div>
                        <div className="last-played-author">{authorName}</div>
                        <div className="last-played-time-left">Time remaining: {timeLeft}</div>
                    </div>
                </Link>
            </div>
        );
    }

}

class Recommendations extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {


        if (!this.props.recommendations || this.props.recommendations.length === 0) return null;

        const recs = this.props.recommendations.map((rec) => {
            const url = "/static/covers/" + rec.cover_file;
            const toUrl = "/store?search=" + rec.title.replaceAll(" ", "+") + "&view=all";
            return (
                <Link className="recommendation" to={toUrl} title={rec.title}>
                    <img className="recommendation-image" src={url} />
                </Link>
            );
        });

        return (
            <div className="recommendations-container">
                <h2 className="recommendations-title">Recommendations</h2>
                <div className="recommendations">
                    {recs}
                </div>
            </div>
        );
    }

}

export { LastPlayed, Recommendations };