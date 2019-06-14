import React, { Component } from 'react';
import './App.css';
import NumberInput from './NumberInput.jsx';

class App extends Component {
  state = {
    totalTime: 0,
    previousTime: 0,
    isResting: false,
    intervalID: null,
    stopped: true,
    pomodoroMinutes: 25,
    restMinutes: 5
  };

  frame = () => {
    this.setState(
      prevState => {
        return {
          totalTime: prevState.totalTime + Date.now() - prevState.previousTime,
          previousTime: Date.now()
        };
      },
      () => {
        if (this.state.isResting) {
          if (this.state.totalTime / 1000 / 60 > this.state.restMinutes) {
            this.setState({
              isResting: false,
              totalTime: 0
            });
          }
        } else {
          if (this.state.totalTime / 1000 / 60 > this.state.pomodoroMinutes) {
            this.setState({
              isResting: true,
              totalTime: 0
            });
          }
        }
      }
    );
  };

  start = () => {
    if (this.state.stopped) {
      this.setState({
        totalTime: 0,
        previousTime: Date.now(),
        isResting: false,
        stopped: false,
        intervalID: setInterval(() => {
          this.frame();
        }, 1000 / 60)
      });
    }
  };

  stop = () => {
    clearInterval(this.state.intervalID);
    this.setState({
      stopped: true
    });
  };

  breakTimeChange = value => {
    this.setState({
      restMinutes: value
    });
  };

  pomodoroTimeChange = value => {
    this.setState({
      pomodoroMinutes: value
    });
  };

  render() {
    const sec = Math.floor(this.state.totalTime / 1000) % 60,
      min = Math.floor(this.state.totalTime / 1000 / 60);
    const clock = `${min}:${sec < 10 ? `0` : ``}${sec}`;

    return (
      <div>
        <span>{clock}</span>
        <div>
          <NumberInput
            value={25}
            min={1}
            changeValue={this.pomodoroTimeChange}
          />
          <span>MIN</span>
          <span>POMODORO</span>
        </div>
        <div>
          <NumberInput value={5} min={1} changeValue={this.breakTimeChange} />
          <span>MIN</span>
          <span>BREAK</span>
        </div>
        {this.state.stopped ? (
          <button onClick={this.start}>Start</button>
        ) : (
          <button onClick={this.stop}>Stop</button>
        )}
        {this.state.stopped ? null : this.state.isResting ? (
          <span>Rest!</span>
        ) : (
          <span>Work on it!</span>
        )}
      </div>
    );
  }
}

export default App;
