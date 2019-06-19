import React, { Component } from 'react';
import './App.css';
import NumberInput from './NumberInput.jsx';
import beep from './assets/beep.ogg';
import beepShort from './assets/beep-short.ogg';

class App extends Component {
  state = {
    isResting: false,
    minutes: 0,
    seconds: 0,
    intervalID: null,
    stopped: true,
    pomodoroMinutes: 25,
    restMinutes: 5,
    started: null
  };

  frame = () => {
    const currentTime = Date.now();
    if (
      currentTime >
      this.state.started +
        this.state.minutes * 60 * 1000 +
        (this.state.seconds + 1) * 1000
    ) {
      let sec = this.state.seconds + 1,
        min = this.state.minutes,
        switchTimer = false;

      if (sec >= 60) {
        sec = 0;
        min += 1;
      }

      if (this.state.isResting) {
        if (min >= this.state.restMinutes) {
          switchTimer = true;
          min = 0;
          sec = 0;
        }
      } else {
        if (min >= this.state.pomodoroMinutes) {
          switchTimer = true;
          min = 0;
          sec = 0;
        }
      }

      this.setState(prevState => {
        return {
          seconds: sec,
          minutes: min,
          isResting: switchTimer ? !prevState.isResting : prevState.isResting,
          started: switchTimer ? Date.now() : prevState.started
        };
      });

      if (switchTimer) this.beep.play();

      let remainingSeconds = 60 - sec - 1;

      if (remainingSeconds <= 2 && remainingSeconds >= 0) {
        this.shortBeep.play();
      }
    }
  };

  start = () => {
    this.beep.play();
    if (this.state.stopped) {
      this.setState({
        minutes: 0,
        seconds: 0,
        isResting: false,
        stopped: false,
        intervalID: setInterval(() => {
          this.frame();
        }, 1000 / 60),
        started: Date.now()
      });
    }
  };

  stop = () => {
    clearInterval(this.state.intervalID);
    this.setState({
      stopped: true,
      isResting: false,
      minutes: 0,
      seconds: 0,
      started: null
    });
  };

  breakTimeChange = value => {
    if (this.state.stopped) {
      this.setState(prevState => {
        return {
          restMinutes: Math.max(prevState.restMinutes + value, 1)
        };
      });
    }
  };

  pomodoroTimeChange = value => {
    if (this.state.stopped) {
      this.setState(prevState => {
        return {
          pomodoroMinutes: Math.max(prevState.pomodoroMinutes + value, 1)
        };
      });
    }
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
              value={this.state.pomodoroMinutes}
              changeValue={this.pomodoroTimeChange}
            />
            <span>min</span>
            <span className="setter-type">POMODORO</span>
          </div>
          <div className="setter-wrapper">
            <NumberInput
              value={this.state.restMinutes}
              changeValue={this.breakTimeChange}
            />
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
