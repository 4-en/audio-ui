import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import './App.css' ;
//import AudioBild from './images/AudioBild.jpg'
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';




class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div>
            <header>
            <a href = "/">

            </a>
            </header>
            <div id = 'bild'>
            <img src = "./static/AudioBild.jpg" alt = "..." />
            <p style = {{ margin: '20px 0' }}> </p>

              <div className='lbutton'>
              <button className='lb'>
              Login
              </button>
              </div>

            <p style = {{margin:'5px 0' }}> </p>
            <div>
            <button class="al-button filter-button "> Regristieren </button>
             </div>

           <nav>
            <ul className = 'mitte'>

            <li> <a href = "/"> <button class="al-button filter-button "> Startseite </button> </a></li>
            <li> <a href = "/#service"><button class="al-button filter-button "> Services </button> </a></li>
            <li> <a href = "/#kontakt"> <button class="al-button filter-button "> Kontakt </button> </a></li>
            </ul>
            </nav>

            </div>

            <p style ={{ margin:'20px 0'}}>
            </p>
            <div>
            <section>
            <h1> Willkommen auf unserer Seite! </h1>

            <p style = {{margin:'5px 0' }}> </p>
            <p> Wir sind stolz darauf, Ihnen eine der umfangreichsten Audiobibliotheken präsentieren zu können. Egal, ob Sie nach einem spannenden Krimi, einem inspirierenden Sachbuch oder einem unterhaltsamen Kinderbuch suchst. Bei uns werden Sie garantiert fündig! </p>
            <p style = {{margin:'20px 0'}}> </p>

            <p>
            Unsere Bibliothek wird ständig aktualisiert, damit du immer die neuesten und angesagtesten Titel hören kannst.
            Und das Beste daran? Sie können unsere Hörbücher und anderen Audiodateien jederzeit und überall anhören. Sei es zu Hause, unterwegs oder im Fitnessstudio. Sie brauchen nur Ihr Smartphone oder Tablet und schon kann es losgehen. Wir sind uns sicher, dass Sie bei uns genau das finden, was Sie suchen!
            </p>
            </section>
            </div>
            <p style = {{margin:'40px 0'}}> </p>
            <section id ="service">

            <h2> Services </h2>
            <p style = {{margin:'5px 0'}}> </p>

            <p> Unsere Website bietet eine Vielzahl von Audio/Hörbuch -Services, die dir ein unvergessliches Hörerlebnis bieten. Egal, ob Sie nach einer Möglichkeit suchen, um deine Lieblingsbücher unterwegs zu hören oder du dich einfach nur zurücklehnen und entspannen möchtest, wir haben alles, was Sie brauchen. Unsere Audio/Hörbuch-Services umfassen eine breite Palette von Genres, von Krimis und Thrillern bis hin zu Liebesromanen und Science - Fiction.Unsere Bibliothek wird ständig aktualisiert, um sicherzustellen, dass du immer die neuesten und besten Hörbücher zur Verfügung hast.Unsere Services sind einfach zu bedienen und bieten eine Vielzahl von Funktionen, die dein Hörerlebnis verbessern.Sie können Ihre Lieblingsbücher markieren, um später darauf zurückzugreifen, die Geschwindigkeit anpassen, um das Hörbuch schneller oder langsamer abzuspielen, und vieles mehr.
            <p style = {{ margin:'20px 0' }}> </p>
            <p> Wir bieten auch eine Vielzahl von Abonnements an, die auf Ihre Bedürfnisse zugeschnitten sind .Egal, ob Sie ein gelegentlicher Hörer sind oder Sie jeden Tag Hörbücher hören, wir haben ein Abonnement, das zu Ihnen passt.
            </p>

            Mit unseren Audio/Hörbuch-Services haben Sie immer Zugriff auf die besten Hörbücher und können sie überall und jederzeit hören. Besuche unsere Website, um mehr über unsere Services zu erfahren und ein unvergessliches Hörerlebnis zu genießen!
            </p>
            </section><p style = {{margin:'40px 0'}}> </p>

            <section id = "kontakt">
            <h3> So kontaktieren Sie uns </h3>
            <p>
            Wenn Sie Fragen, Anregungen oder Feedback haben, können Sie uns jederzeit kontaktieren. Füllen Sie einfach das untenstehende Formular aus oder senden Sie uns eine E - Mail an[...]. Wir werden uns so schnell wie möglich bei Ihnen melden. Sie können uns auch telefonisch erreichen unter[...] während unserer Geschäftszeiten von[...].
            </p>
            </section>
            <p style = {{ margin: '20px 0' }}> </p>
            <p> Also, worauf warten Sie noch ? Stöbere durch unsere Bibliothek und tauche ein in die Welt der Hörbücher!
            </p>
            <p style = {{margin: '20px 0'}}> </p>

            <p style = {{ margin: '35px 0' }}> </p>
            <div>
             <h1> Empfehlungen </h1>
             <div id="carouselExampleIndicators" class="carousel slide">
               <div class="carousel-indicators">
                 <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                 <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                 <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
               </div>
               <div class="carousel-inner">
                 <div class="carousel-item active">
                   <img src="static/covers/4e5bb511-b489-409a-b8d4-848c65bbbcba.jpg" class="libEntryCover extended" alt="cover" height="138" width="138"/>
                 </div>
                 <div class="carousel-item">
                   <img src="static/covers/38d2ff81-2eb8-4b3d-ade7-4210257aef65.jpg" class= "libEntryCover" alt="cover" height="138" width="138"/>
                 </div>
                 <div class="carousel-item">
                   <img src="..." class="d-block w-100" alt="..."/>
                 </div>
               </div>
               <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                 <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                 <span class="visually-hidden">Previous</span>
               </button>
               <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                 <span class="carousel-control-next-icon" aria-hidden="true"></span>
                 <span class="visually-hidden">Next</span>
               </button>
             </div>


            </div>

             <div>

            <Link to = "/library" > Besuchen Sie die Liberary ohne Anmeldung </Link>
            </div>




            <div>
            <nav>
            <ul className = 'mitte'>
            <li> <a href = "/"> Impressum </a></li>
            <li> <a href = "/"> Datenschutz </a></li>
            </ul>
            </nav>
            </div>

            </div>



        );
    }
}

export default Home;
