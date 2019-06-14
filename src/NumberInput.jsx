import React, { Component } from 'react';

export default class NumberInput extends Component {
  state = {
    value: this.props.value || 25
  };

  add = () => {
    this.setState(
      prevState => {
        return {
          value: prevState.value + 1
        };
      },
      () => {
        this.props.changeValue && this.props.changeValue(this.state.value);
      }
    );
  };

  subtract = () => {
    if (this.state.value > 1) {
      this.setState(
        prevState => {
          return {
            value: prevState.value - 1
          };
        },
        () => {
          this.props.changeValue && this.props.changeValue(this.state.value);
        }
      );
    }
  };

  render() {
    return (
      <div>
        <button onClick={this.subtract}>-</button>
        <input type="number" value={this.state.value} readOnly />
        <button onClick={this.add}>+</button>
      </div>
    );
  }
}
