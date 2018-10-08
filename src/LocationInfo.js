import React, {Component} from "react";
import "./App.css";

class LocationInfo extends Component {
  render() {
    return (
      <div>
        <div className='info-container'>
          <h2>{this.props.venue}</h2>
          <h3>{this.props.address}</h3>
          <h3>{this.props.category}</h3>
        </div>
      </div>
    );
  }
}

export default LocationInfo;
