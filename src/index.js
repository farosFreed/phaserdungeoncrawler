import React from "react";
import ReactDOM from "react-dom";
//import { StoreContext } from "storeon/react";


//import "./assets/main.css";

import Main from "./Main";
// creating the eventBridge
import "./bridge";


//import * as serviceWorker from './serviceWorker';
//import { store } from "store";

import "./phaser";


window.eventBridge.on('phaser:ready', () => {
  console.log('phaser ready received');
  store.dispatch('phaserReady');
});

window.eventBridge.on('phaser:storeon', ({ type, payload = null }) => {
  console.log('bridge event received', { type, payload });
  store.dispatch(type, payload);
});


ReactDOM.render(
  //<StoreContext.Provider value={store}>
    <React.StrictMode>
      <Main />
    </React.StrictMode>
  //</StoreContext.Provider>,
  document.getElementById("uiRoot")
);

//serviceWorker.unregister();