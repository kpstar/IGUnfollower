import React, { Component } from 'react';
import { Provider } from 'react-redux';
import RNRestart from 'react-native-restart';
import codePush from 'react-native-code-push';
import { StatusBar, YellowBox, I18nManager } from 'react-native';
import AppNavigation from './utils/AppNavigation';
import { Colors } from './constances';
import { Container } from './components/commons';
import InitAxios from './utils/InitAxios';
import Store from './redux/store';

YellowBox.ignoreWarnings([
  'ٌRemote debugger', 'Require',
]);

console.ignoredYellowBox = true;
I18nManager.forceRTL(false);
I18nManager.allowRTL(false);
if (I18nManager.isRTL) {
  RNRestart.Restart();
}
class App extends Component {
  constructor(props) {
    super(props);
    InitAxios();
  }
  async componentWillMount() {
    codePush.sync({
      updateDialog: false,
      installMode: codePush.InstallMode.IMMEDIATE,
    });
  }
  render() {
    return (
      <Provider store={Store}>
        <Container>
          <StatusBar backgroundColor={Colors.StateBarColor} barStyle="light-content" />
          <AppNavigation />
        </Container>
      </Provider>
    );
  }
}

export default codePush(App);
