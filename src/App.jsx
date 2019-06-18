import React, { Component } from 'react';
import './App.css';
import NumberInput from './NumberInput.jsx';
import beep from './assets/beep.ogg';
import beepShort from './assets/beep-short.ogg';

class App extends Component {
  state = {
    totalTime: 0,
    previousTime: 0,
    isResting: false,
    minutes: 0,
    seconds: 0,
    intervalID: null,
    stopped: true,
    pomodoroMinutes: 25,
    restMinutes: 5
  };

  frame = () => {
    this.setState(
      prevState => {
        const totalTime =
          prevState.totalTime + Date.now() - prevState.previousTime;
        const sec = Math.floor(totalTime / 1000) % 60,
          min = Math.floor(totalTime / 1000 / 60);

        return {
          totalTime,
          minutes: min,
          seconds: sec,
          previousTime: Date.now()
        };
      },
      () => {
        if (this.state.isResting) {
          if (this.state.totalTime / 1000 / 60 > this.state.restMinutes) {
            this.setState({
              isResting: false,
              totalTime: 0,
              minutes: 0,
              seconds: 0
            });
            this.beep.play();
          }
        } else {
          if (this.state.totalTime / 1000 / 60 > this.state.pomodoroMinutes) {
            this.setState({
              isResting: true,
              totalTime: 0,
              minutes: 0,
              seconds: 0
            });
            this.beep.play();
          }
        }
      }
    );
  };

  start = () => {
    this.beep.play();
    if (this.state.stopped) {
      this.setState({
        totalTime: 0,
        minutes: 0,
        seconds: 0,
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
      stopped: true,
      isResting: false,
      minutes: 0,
      seconds: 0
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
    let remainingMinutes, remainingSeconds;

    if (this.state.stopped) {
      remainingMinutes = this.state.pomodoroMinutes - this.state.minutes;
      remainingSeconds = 0;
    } else {
      if (this.state.isResting) {
        remainingMinutes = this.state.restMinutes - this.state.minutes - 1;
      } else {
        remainingMinutes = this.state.pomodoroMinutes - this.state.minutes - 1;
      }
      remainingSeconds = 60 - this.state.seconds - 1;
    }

    const clock = `${remainingMinutes}:${
      remainingSeconds < 10 ? `0` : ``
    }${remainingSeconds}`;

    return (
      <div className="main-pomodoro">
        <span className="timer">{clock}</span>
        <div className="setters-container">
          <div className="setter-wrapper">
            <NumberInput
              value={25}
              min={1}
              changeValue={this.pomodoroTimeChange}
            />
            <span>min</span>
            <span className="setter-type">POMODORO</span>
          </div>
          <div className="setter-wrapper">
            <NumberInput value={5} min={1} changeValue={this.breakTimeChange} />
            <span>min</span>
            <span className="setter-type">BREAK</span>
          </div>
        </div>
        <span className="prompt">
          {this.state.stopped
            ? 'Set the timers and press start'
            : this.state.isResting
            ? 'Rest!'
            : 'Work on it!'}
        </span>
        <div className="trigger-container">
          {this.state.stopped ? (
            <button onClick={this.start} className="trigger">
              Start
            </button>
          ) : (
            <button onClick={this.stop} className="trigger">
              Stop
            </button>
          )}
        </div>
        <audio ref={ref => (this.beep = ref)} src={beep} />
        <audio ref={ref => (this.shortBeep = ref)} src={beepShort} />
      </div>
    );
  }
}

export default App;
