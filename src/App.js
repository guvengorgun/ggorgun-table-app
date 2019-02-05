import React, { Component } from 'react';
import { Provider } from 'react-redux';
import MyTableViewer from './components/MyTableViewer/';
import store from './store';

class App extends Component {
  render() {
    return (
        <Provider store={store}>
            <div className="App">
                <header className="My Table">
                    <MyTableViewer />
                </header>
            </div>
        </Provider>
    );
  }
}

export default App;
