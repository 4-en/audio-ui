import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import AudioBild from './images/AudioBild.jpg'


class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return ( <
            body >
            <
            > < div >
            <
            header >
            <
            a href = "/" >

            <
            /a> <
            /header> <
            div id = 'bild' >
            <
            img src = "./static/AudioBild.jpg"
            alt = "..." /
            >
            <
            p style = {
                { margin: '20px 0' } } > < /p>


            <
            nav >
            <
            ul className = 'mitte' >
            <
            li > < a href = "/" > Startseite < /a></li >
            <
            li > < a href = "/#service" > Services < /a></li >
            <
            li > < a href = "/#kontakt" > Kontakt < /a></li >
            <
            /ul> <
            /nav>

            <
            /div>

            <
            p style = {
                { margin: '20px 0' } } > < /p> <
            div >
            <
            section >
            <
            h1 > Willkommen auf unserer Seite! < /h1> <
            p style = {
                { margin: '5px 0' } } > < /p> <
            p > Wir sind stolz darauf, Ihnen eine der umfangreichsten Audiobibliotheken präsentieren zu können. < br / > Egal, ob Sie nach einem spannenden Krimi, einem inspirierenden Sachbuch oder einem unterhaltsamen Kinderbuch suchst.Bei uns werden Sie garantiert fündig! < /p> <
            p style = {
                { margin: '20px 0' } } > < /p>

            <
            p >
            Unsere Bibliothek wird ständig aktualisiert, damit du immer die neuesten und angesagtesten Titel hören kannst.Und das Beste daran ? Sie kannst unsere Hörbücher und anderen Audio - Dateien jederzeit und überall anhören.Sei es zu Hause, unterwegs oder im Fitnessstudio.Sie brauchen nur dein Smartphone oder Tablet und schon kann es losgehen.Wir sind uns sicher, dass Sie bei uns genau das finden, was Sie suchen!
            <
            /p> <
            /section> <
            /div> <
            p style = {
                { margin: '40px 0' } } > < /p> <
            section id = "service" >
            <
            h2 > Services < /h2> <
            p style = {
                { margin: '5px 0' } } > < /p> <
            p >
            Unsere Website bietet eine Vielzahl von Audio - und Hörbuch - Services, die dir ein unvergessliches Hörerlebnis bieten.Egal, ob Sie nach einer Möglichkeit suchen, um deine Lieblingsbücher unterwegs zu hören oder du dich einfach nur zurücklehnen und entspannen möchtest, wir haben alles, was Sie brauchen.Unsere Audio - und Hörbuch - Services umfassen eine breite Palette von Genres, von Krimis und Thrillern bis hin zu Liebesromanen und Science - Fiction.Unsere Bibliothek wird ständig aktualisiert, um sicherzustellen, dass du immer die neuesten und besten Hörbücher zur Verfügung hast.Unsere Services sind einfach zu bedienen und bieten eine Vielzahl von Funktionen, die dein Hörerlebnis verbessern.Sie können Ihre Lieblingsbücher markieren, um später darauf zurückzugreifen, die Geschwindigkeit anpassen, um das Hörbuch schneller oder langsamer abzuspielen, und vieles mehr. <
            p style = {
                { margin: '20px 0' } } > < /p> <
            p > Wir bieten auch eine Vielzahl von Abonnements an, die auf deine Bedürfnisse zugeschnitten sind.Egal, ob Sie ein gelegentlicher Hörer sind oder jeden Tag Hörbücher hörst, wir haben ein Abonnement, das zu dir passt. <
            /p>

            Mit unseren Audio - und Hörbuch - Services haben Sie immer Zugriff auf die besten Hörbücher und kannst sie überall und jederzeit hören.Besuche unsere Website, um mehr über unsere Services zu erfahren und ein unvergessliches Hörerlebnis zu genießen!
            <
            /p> <
            /section> <
            /div> <
            p style = {
                { margin: '40px 0' } } > < /p>

            <
            section id = "kontakt" >
            <
            h1 > So kontaktieren Sie uns < /h1> <
            p >
            Wenn Sie Fragen, Anregungen oder Feedback haben, können Sie uns jederzeit kontaktieren.Füllen Sie einfach das untenstehende Formular aus oder senden Sie uns eine E - Mail an[...].Wir werden uns so schnell wie möglich bei Ihnen melden.Sie können uns auch telefonisch erreichen unter[...] während unserer Geschäftszeiten von[...]. <
            /p> <
            /section> <
            p style = {
                { margin: '20px 0' } } > < /p> <
            p >
            Also, worauf warten Sie noch ? Stöbere durch unsere Bibliothek und tauche ein in die Welt der Hörbücher!
            <
            /p> <
            p style = {
                { margin: '20px 0' } } > < /p> <
            div >

            <
            Link to = "/library" > Besuchen Sie die Liberary ohne Anmeldung < /Link> <
            /div></ >
            <
            p style = {
                { margin: '35px 0' } } > < /p>

            <
            div >
            <
            nav >
            <
            ul className = 'mitte' >
            <
            li > < a href = "/" > Impressum < /a></li >
            <
            li > < a href = "/" > Datenschutz < /a></li >
            <
            /ul>

            <
            /nav> <
            /div>      <
            /body>
        );
    }
}

export default Home;