import React, { Component } from 'react';

export default class NumberInput extends Component {
  add = () => {
    this.props.changeValue && this.props.changeValue(1);
  };

  subtract = () => {
    this.props.changeValue && this.props.changeValue(-1);
  };

  render() {
    return (
      <div>
        <button onClick={this.subtract}>-</button>
        <input type="number" value={this.props.value} readOnly />
        <button onClick={this.add}>+</button>
      </div>
    );
  }
}
