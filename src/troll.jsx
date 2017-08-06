
/*
 * Troll app
 *
 */

// Libs
import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {connect, Provider} from 'react-redux';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import ReactThunk from 'redux-thunk';

// App
import iconUrl from './99lp.png';

//////////////
// App

const kazeResponses = [
  'kys', 'kys', 'kys', 'kys', 'garbage',
  '?', '??', '???', '???',
  '????????????????????',
  'u don\`t know how to play the game',
  'get good', 'cy@', 'cy@',
  'trash', 'trash', 'trash players',
  'mfw carries are monkeys',
  'boosted', 'u dont know how to win',
  '? do u have amazon stocks ???'
];

const questionMarkRegex = /^\?*$/;

function getKazeResponse(msg) {
  // Actual responses
  let trimmed = msg.trim();
  if (questionMarkRegex.test(trimmed)) return '?';
  if (trimmed.indexOf('kys') != -1) return 'unranked and bad';
  if (trimmed.indexOf('?') == trimmed.length - 1) return 'no';
  if (trimmed.indexOf('hello') == 0) return 'hi trash';
  if (trimmed.indexOf('sup') == 0) return 'hi shitter';
  if (trimmed.indexOf('hi') == 0) return 'hi trash';
  if (trimmed.indexOf('skt') != -1) return '? another worlds another victory';
  if (trimmed.indexOf('fuck') != -1) return 'what is this profanity';

  // Uniformly pick a message
  let p = 1.0 / kazeResponses.length;
  let q = Math.floor(Math.random() / p);
  return kazeResponses[q];
}

///////////////
// Redux

// <Action creators>

function newMsg(msg) {
  return {type: 'NEW_MSG', msg};
}

function kazeMsg(msg) {
  return {type: 'KAZE_MSG', msg};
}

function newMsgWithResponse(msg) {
  return (dispatch, getState) => {
    if (!getState().isKazeResponding) {
      setTimeout(() => {
        dispatch(kazeMsg(getKazeResponse(msg)));
      }, Math.random() * 2000 + 20 * msg.length);
    }
    dispatch(newMsg(msg));
  };
}

// <Reducers>

const defaultState = {
  text: 'Welcome to AMA with IK a z e, rank #1 at Amazon!\n---------------\n',
  isKazeResponding: false
};

function trollAppReducer(state = defaultState, action) {
  switch (action.type) {
    case 'NEW_MSG':
      return Object.assign({}, state, {
        text: state.text + `You: ${action.msg}\n`,
        isKazeResponding: true
      });
    case 'KAZE_MSG':
      return Object.assign({}, state, {
        text: state.text + `IK a z e: ${action.msg}\n`,
        isKazeResponding: false
      });
    default:
      return state;
  }
}

/////////////////////////////////
// Presentation components

// For entering a message into the chat
// [Props: onMessageSent]
class ChatLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  onChange(e) { // Maintain this SIMPLE state using React, not Redux
    this.setState({value: e.target.value});
  }

  sendMessage(msg) {
    if (msg.trim() == '') return;
    this.props.onMessageSent(msg);
    this.setState({value: ''});
  }

  onClick(e) {
    this.sendMessage(this.state.value);
  }

  onKeyDown(e) {
    if (e.keyCode == 13) {
      this.sendMessage(this.state.value);
    }
  }

  render() {
    return (
      <div className='panel panel-default'>
        <div className='panel-body'>
          <button 
            style={{float: 'right', marginLeft: '5px', height: '100%'}}
            className='btn btn-primary'
            onClick={this.onClick}>Send</button>
          <div style={{overflow: 'hidden'}}>
            <input
              style={{width: '100%', height: '100%', fontSize: 'x-large'}}
              className='focus-hack form-control'
              value={this.state.value}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}></input>
          </div>
        </div>
      </div>
    );
  }
}

// The chat box
// [Props: contents]
class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange() {}

  componentDidUpdate() {
    this.domRef.scrollTop = this.domRef.scrollHeight;
  }

  render() {
    return (
      <textarea 
        ref={(a) => this.domRef = a}
        style={{width: '100%', height: '100%', fontSize: 'x-large'}}
        value={this.props.contents}
        onChange={this.onChange}></textarea>
    );
  }
}

// Main app
// [Props: contents, onMessageSent]
function TrollApp(props) {
  return (
    <div style={{height: '100%'}}>
      <div style={{height: 'calc(20% - 70px)', backgroundImage: `url(${iconUrl})`, backgroundSize: 'contain'}} />
      <div style={{height: 'calc(80% - 70px)'}}>
        <ChatBox contents={props.contents} />
      </div>
      <div style={{height: '70px'}}>
        <ChatLine onMessageSent={props.onMessageSent} />
      </div>
    </div>
  );
}

//////////////////////////////
// Container components

// <Main app container>

const mapStateToProps = (state) => {
  return {
    contents: state.text
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onMessageSent: (msg) => {
      dispatch(newMsgWithResponse(msg));
    }
  };
}

const TrollAppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TrollApp);

///////////////////
// Run

// Store
let store = createStore(trollAppReducer, applyMiddleware(ReactThunk));

ReactDOM.render((
  <Provider store={store}>
    <TrollAppContainer />
  </Provider>
), document.getElementById('root'), () => {
  document.getElementsByClassName('focus-hack')[0].focus();
});

