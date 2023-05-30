import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import UsertestApp from './UsertestApp';
import reportWebVitals from './reportWebVitals';

/*
* old function to load static library for user testing
async function loadLibrary() {
  const response = await fetch('static/library.json');
  const data = await response.json();
  return data;
}
*/

// enable/disable user testing mode
const TESTMODE = false;

var listeners = [];
const testCallback = (payload) => {
  for (var i = 0; i < listeners.length; i++) {
    listeners[i](payload);
  }
};



const root = ReactDOM.createRoot(document.getElementById('root'));
const testroot = ReactDOM.createRoot(document.getElementById('testroot'));


root.render(
  <React.StrictMode>
    <App callback={testCallback} />
  </React.StrictMode>
);

if (TESTMODE) {
  testroot.render(
    <React.StrictMode>
      <UsertestApp listeners={listeners} />
    </React.StrictMode>
  );
}





// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
