import React, {Component} from "react";
import "./App.css";

class LocationInfo extends Component {
  render() {
    return (
      <div>
        <div className='info-container'>
          <h4>{this.props.venue}</h4>
          <h5>{this.props.address}</h5>
          <h5>{this.props.category}</h5>
        </div>
      </div>
    );
  }
}

export default LocationInfo;
