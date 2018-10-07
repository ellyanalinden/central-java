import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';
import axios from 'axios';
import AppTitle from './AppTitle'
import iconRedUrl from './location-pointer-red.svg'
import iconBlueUrl from './location-pointer-blue.svg'


const redIcon = L.icon({
    iconUrl: iconRedUrl,
    iconSize: [38, 95], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

const blueIcon = L.icon({
    iconUrl: iconBlueUrl,
    iconSize: [38, 95], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      location: {
        lat: -7.6079,
        lng: 110.2038
      },
      zoom: 13,
      places: [],
      filtered: [],
      filter: ''
    };
  }

  placeClicked = (placeId) => {
      let places = this.state.places;
      places.forEach(place => {
          if(placeId === place.venue.id) {
              console.log('match at place' + place.venue.name)
              place.placeClicked = true;
          } else {
              place.placeClicked = false;
          }
      });
      this.setState({places});
    }

    places(){
      setTimeout(() => {
        this.setState({
        placeClicked: false
        })
      }, 1500);
    }

  componentDidMount() {
    this.getPlaces()
  }

  getPlaces = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "POKXMHQJY0EHTRGZEPMVWPJDWMUTSVRRINJILUSE5WZTSTUI",
      client_secret: "N4QKO4TTH4QKBFQ3SBYHUTQ5RUWMGAZ0B5JDYUE0H3V2W151",
      section: "nextVenues",
      near: "Borobudur",
      limit: "10",
      v: "20180725"
    }
    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        console.log(response.data.response.groups[0].items)
        this.setState({
          places: response.data.response.groups[0].items
        })
      })
      .catch(error => {
        console.log("Error!" + error)
      })
    }

  filter = filter => {
    this.setState({filter});
    const filtered = this.state.places.filter (place =>
        place.venue.name.toLowerCase()
        .indexOf(this.state.filter.toLowerCase()) !== -1);
        this.setState({filtered});
  };

  render() {
    const position = [this.state.location.lat, this.state.location.lng];
    let places = this.state.places
    if(this.state.filter.length>0){
      places = this.state.filtered
    }

    return (
      <div className="main-wrap">
        <AppTitle />
        <div className="map" aria-label="map-description" role="application" aria-hidden="true">
          <Map className="map"
            center={position}
            zoom={this.state.zoom}>

            <TileLayer
              attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {places.map(place => (
                <Marker
                key={place.venue.id}
                position={[place.venue.location.lat, place.venue.location.lng]}
                icon={place.placeClicked ? redIcon : blueIcon}
                      zIndexOffset={place.placeClicked ? 10000 : 0}
                      onClick={(e) => {
                        console.log(e);
                        e.target.setIcon(redIcon);
                        setTimeout(() => {
                          e.target.setIcon(blueIcon);
                        }, 1500);
                      }}>
                <Popup>
                  <p className="place-name">{[place.venue.name]}</p>
                  <p className="place-address">{[place.venue.location.address]}</p>
                  <p className="place-category">{[place.venue.categories[0].name]}</p>
                </Popup>
                </Marker>
              ))}
          </Map>
        </div>
        <aside className = 'side-container'>
          <input className = 'search-box'
            tabIndex="0"
            aria-label= "input-box"
            type='text'
            onChange={e => this.filter(e.target.value)}
            value={this.state.filter} />

          <div className = 'list-container'>
            {places.map(place =>
              <p className = 'list-places'
                 tabIndex="0"
                 role="link"
                 key={place.venue.id}
                 >
                 {place.venue.name}
              </p>
            )}
          </div>
        </aside>
      </div>
    );
  }
}
export default App;
