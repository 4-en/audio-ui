import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import './App.css';
import { LastPlayed, Recommendations } from './HomeComponents';
//import AudioBild from './images/AudioBild.jpg'
//import Button from 'react-bootstrap/Button';
//import 'bootstrap/dist/css/bootstrap.min.css';
//import Carousel from 'react-bootstrap/Carousel';




class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastPlayed: null,
      recommendations: null,
    };

  }

  async componentDidMount() {

    var tasks = [];
    var sid = "randomandlongstringmaybenotrandom";
    if (this.props.user) {
      const user = this.props.user;

      var lpTask = async () => {
        const lpRequest = await this.props.app.apiRequest("/last_played/", "POST", { session_id: user.session_id });
        if (lpRequest.status === 200) {
          const lastPlayed = await lpRequest.json();
          this.setState({ lastPlayed: lastPlayed.item });
          sid = user.session_id;
        }
      }
      lpTask = lpTask.bind(this);
      tasks.push(lpTask);
    } else {
      this.setState({ lastPlayed: null });
    }

    var recTask = async () => {
      const recRequest = await this.props.app.apiRequest("/recommend/", "POST", {
        session_id: sid,
        amount: 5
      });
      if (recRequest.status === 200) {
        const recommendations = await recRequest.json();
        this.setState({ recommendations: recommendations.items });
      }
    }
    recTask = recTask.bind(this);
    tasks.push(recTask);

    for (var i = 0; i < tasks.length; i++) {
      tasks[i]();
    }
  }



  render() {
    return (
      <div>
             <header>
               <Link to="/login">
                 <div className="al-button filter-button ">
                  <button className= 'al'>Login </button>
                </div>
               </Link>

               <Link to="/login">
                 <div className="al-button filter-button ">
                   <button className= 'fb'>Regristrieren </button>
                  </div>
                </Link>
              </header>

              <body>
              //Platz für Karusell
              </body>
               <section>
                 <h1> Willkommen auf unserer Seite! </h1>

                 <p>
                 Wir sind stolz darauf, Ihnen eine der umfangreichsten Audiobibliotheken präsentieren zu können.
                 Egal, ob Sie nach einem spannenden Krimi, einem inspirierenden Sachbuch oder einem unterhaltsamen Kinderbuch suchen.Bei uns werden Sie garantiert fündig!
                 </p>


                 <p>
                 Unsere Bibliothek wird ständig aktualisiert, damit Sie immer die neuesten und angesagtesten Titel hören können.
                 Und das Beste daran? Sie können unsere Hörbücher und anderen Audiodateien jederzeit und überall anhören.
                 Sei es zu Hause, unterwegs oder im Fitnessstudio. Sie brauchen nur Ihr Smartphone oder Tablet und schon kann es losgehen.
                 Wir sind uns sicher, dass Sie bei uns genau das finden, was Sie suchen!
                 </p>
                 </section>



                 <section id="service">
                  <h2> Services </h2>


                    <div>
                      Unsere Website bietet eine Vielzahl von Audio/Hörbuch -Services, die Ihnen ein unvergessliches Hörerlebnis bieten.
                      Egal, ob Sie nach einer Möglichkeit suchen, um Ihre Lieblingsbücher unterwegs zu hören oder Sie  einfach nur zurücklehnen und entspannen möchten, wir haben alles, was Sie brauchen.
                      Unsere Audio/Hörbuch-Services umfassen eine breite Palette von Genres, von Krimis und Thrillern bis hin zu Liebesromanen und Science - Fiction.
                      Unsere Bibliothek wird ständig aktualisiert, um sicherzustellen, dass Sie immer die neuesten und besten Hörbücher zur Verfügung haben.
                      Unsere Services sind einfach zu bedienen und bieten eine Vielzahl von Funktionen, die Ihr Hörerlebnis verbessern. Sie können Ihre Lieblingsbücher markieren, um später darauf zurückzugreifen, die Geschwindigkeit anpassen, um das Hörbuch schneller oder langsamer abzuspielen, und vieles mehr.


                      <p>
                      Wir bieten auch eine Vielzahl von Abonnements an, die auf Ihre Bedürfnisse zugeschnitten sind.
                      Egal, ob Sie ein gelegentlicher Hörer sind oder Sie jeden Tag Hörbücher hören, wir haben ein Abonnement, das zu Ihnen passt.
                      </p>

                      Mit unseren Audio/Hörbuch-Services haben Sie immer Zugriff auf die besten Hörbücher und können sie überall und jederzeit hören. Besuche unsere Website, um mehr über unsere Services zu erfahren und ein unvergessliches Hörerlebnis zu genießen!
                   </div>

                      </section><p style={{ margin: '40px 0' }}> </p>

                    <section id="kontakt">
                      <h3> So kontaktieren Sie uns </h3>
                       <p>
                       Wenn Sie Fragen, Anregungen oder Feedback haben, können Sie uns jederzeit kontaktieren. Füllen Sie einfach das untenstehende Formular aus oder senden Sie uns eine E - Mail an[...]. Wir werden uns so schnell wie möglich bei Ihnen melden. Sie können uns auch telefonisch erreichen unter[...] während unserer Geschäftszeiten von[...].
                       </p>
                    </section>

                    <p style={{ margin: '20px 0' }}> </p>

                    <p>
                    Also, worauf warten Sie noch ? Stöbere durch unsere Bibliothek und tauche ein in die Welt der Hörbücher!
                    </p>
                    <p style={{ margin: '35px 0' }}> </p>

         </div>
        );
    }
}

export default Home;
