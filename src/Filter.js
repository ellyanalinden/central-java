import React, {Component} from "react";
import './App.css';
import { Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
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

class Filter extends Component {
  constructor () {
    super();
    this.state = {
      places: [],
      filteredPlaces: []
    };
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
        alert("Error!" + error)
      })
    }

  filter(e) {
    this.setState({filter: e.target.value})
  }

  placeClicked(placeId) {
   this.props.placeClicked(placeId)
  }

  render() {
    let places = this.state.places

    if(this.state.filter) {
      places = places.filter ( place =>
        place.venue.name.toLowerCase()
        .includes(this.state.filter.toLowerCase()))
    }

    return (
      <aside className = 'side-container'>
        <input className = 'search-box'
          tabIndex="0"
          aria-label= "input-box"
          type='text'
          onChange={this.filter.bind(this)} />

        <div className = 'list-container'>
          {places.map(place =>
            <p className = 'list-places'
               tabIndex="0"
               role="link"
               key={place.venue.id}
               onClick={e=>this.placeClicked(place.venue.id)}>
               {place.venue.name}
            </p>
          )}
        </div>
      </aside>
    );
  }
}

export default Filter;
