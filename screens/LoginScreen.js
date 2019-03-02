import React, { Component } from 'react';
import axios from 'axios';
import { StackActions, NavigationActions } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import { StyleSheet,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
  YellowBox,
  Platform,
  Alert,
  KeyboardAvoidingView, 
} from 'react-native';
import { Container, Text, ViewCenter, View, IconButton } from '../components/commons';
import { Colors, API } from '../constances';
import { generateUUID, SignterData } from '../utils';
import DetectPhone from '../components/DetectPhone';
import User from '../utils/User';

YellowBox.ignoreWarnings(['Warning:', 'Remote', 'Module', 'Possible']);

const makeid = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }

  return text;
};

export const Input = (props) => (
  <TextInput
    autoCorrect={false}
    autoCapitalize='none'
    underlineColorAndroid={Colors.SecanderyColor}
    style={[{ fontSize: 16 }, Platform.OS === 'ios' && styles.inputIOS]}
    {...props}
  />
);
class LoginScreen extends Component {
 static navigationOptions ={
   header: null,
 }
 constructor(props) {
   super(props);

   this.state = {
     username: '',
     password: '',
     loading: true,
     moreThanAccounts: false,
     accounts: [],
   };
   this.login = this.login.bind(this);
   this.init();
 }
 
 openHome() {
   this.props.navigation.dispatch(StackActions.reset({
     index: 0,
     actions: [
       NavigationActions.navigate({ routeName: 'Home' }),
     ],
   }));
 }
 async init() {
   try {
     const account = await AsyncStorage.getItem('acc');
     if (account) {
       const { username, password } = JSON.parse(account);
       this.setState({ username, password }, () => {
         this.login();
       });
     } else {
       
       this.setState({ loading: false });
       let accounts = await AsyncStorage.getItem('accounts');
       accounts = JSON.parse(accounts);
       console.log(accounts);
       if (accounts.length) {
         console.log('slkdlkasdk');
         this.setState({ accounts, moreThanAccounts: true });
       }
       console.log(accounts);
     }
   } catch (error) {
     this.setState({ loading: false });
   }
 }

 async login() {
   this.setState({ loading: true });
   const { username, password } = this.state;

   const data = ({
     device_id: `${Platform.OS}-${DeviceInfo.getUniqueID()}`,
     guid: generateUUID(),
     phone_id: `${makeid(8)}-${makeid(4)}-${makeid(4)}-${makeid(4)}-${makeid(8)}`,
     username,
     password,
     login_attempt_count: 0,
   });
   //  const data = ({
   //    device_id: 'android-b0521653cs5df2347',
   //    guid: generateUUID(),
   //    phone_id: '17193d78-ed72-474f-af07-179ccff76107',
   //    username,
   //    password,
   //    login_attempt_count: 0,
   //  });
   console.log(data);
   try {
     console.log('Start Login');
     const res = await axios.post(API.LOGIN, SignterData(data));
     // for android 
     if (Platform.OS !== 'ios') {
       if (res.headers['set-cookie'][0]) {
         axios.defaults.headers.common.Cookie = res.headers['set-cookie'][0];
       }
     }
     if (res.data.logged_in_user) {
       const resInfo = await axios.post(API.USER_INFO(res.data.logged_in_user.pk));
       console.log(resInfo);
       User.LoginInfo = resInfo.data.user;
       await AsyncStorage.setItem('acc', JSON.stringify({ username, password }));
       const accounts = await AsyncStorage.getItem('accounts');
       if (accounts) {
         let jsonAccounts = JSON.parse(accounts);
         if (jsonAccounts.filter((a) => a.username === username).length === 0) {
           jsonAccounts = [{ username, password }, ...jsonAccounts];
           await AsyncStorage.setItem('accounts', JSON.stringify(jsonAccounts));
         }
       } else {
         await AsyncStorage.setItem('accounts', JSON.stringify([{ username, password }])); 
       }
       this.openHome();
     }
   } catch ({ response }) {
     console.log(response);
     this.setState({ loading: false, password: '' });
     this.inputPassword.clear();
     if (response.data.message) {
       if (/checkpoint_required/.test(response.data.message)) {
         Alert.alert('CheckPoint', 'open your account from Instagram app to verify and try login again \n for security');
       } else {
         alert(response.data.message);
       }
     }
   }
 }
 remoreAccount(acc) {
   const accounts = this.state.accounts.filter((a) => a.username !== acc.username);
   this.setState({ accounts });
   AsyncStorage.setItem('accounts', JSON.stringify(accounts));
 }
 render() {
   console.log(this.state.moreThanAccounts);
   const { username, password } = this.state;
   let isPhoneX = false;
   isPhoneX = DetectPhone.isIphoneXorAbove();
   const renderLogo = (
     <ViewCenter>
       <Image
         style={styles.image}
         source={require('../assets/images/logo.png')}
       />
       <Text style={{ fontSize: 20 }}>
    UnFollowers
       </Text>
     </ViewCenter>
   );
   if (this.state.moreThanAccounts) {
     return (
       <Container style={styles.container} >
         {renderLogo}
         <View style={{ marginHorizontal: 24, justifyContent: 'center', flex: 1 }}>
           {this.state.accounts.map((acc) => (
             <TouchableOpacity
               onPress={() => 
                 this.setState({ ...acc, moreThanAccounts: false }, () => {
                   this.login();
                 })}
               key={acc.username} style={{
                 padding: 10,
                 marginBottom: 5,
                 borderWidth: 2,
                 flexDirection: 'row',
                 justifyContent: 'space-between',
                 borderColor: '#eee',
                 //  backgroundColor: 'rgba(0,0,0,.4)',
               }}
             >
               <Text>{acc.username}</Text>
               <IconButton
                 onPress={() => this.remoreAccount(acc)}
                 name='md-close' color={Colors.SecanderyColor}
               />
             </TouchableOpacity>
           ))}
           <TouchableOpacity 
             onPress={() => this.setState({ moreThanAccounts: false })}
             style={{ justifyContent: 'center', padding: 10, flexDirection: 'row', backgroundColor: Colors.SecanderyColor }}
           >
             <Text style={{ color: 'white' }}>Add Account </Text>
             <IconButton name='md-add' color='white' />
           </TouchableOpacity>
         </View>
       </Container>
     );
   }
   if (this.state.loading) {
     return (
       <Container style={styles.container} >
         {renderLogo}
         <ViewCenter style={{ flex: 1 }}>
           <ActivityIndicator size='large' color={Colors.SecanderyColor} />
         </ViewCenter>
       </Container>
     );
   }
   return (
     <Container style={styles.container} >
       <KeyboardAvoidingView behavior="position" flex={1} >
         {renderLogo}
         <View style={{marginHorizontal: 40, marginTop: isPhoneX == true ? 170: 50}}>
           <View style={styles.form}>
             <Text style={{ fontStyle: 'italic' }}> Sign to your instagram account</Text>
           </View>
           <View style={styles.form}>
             <Input 
               placeholder='Username'
               onChangeText={(t) => { this.setState({ username: t }); }}    
               defaultValue={username}
             />
           </View>
           <View style={styles.form}>
             <TextInput
               ref={(r) => { this.inputPassword = r; }}
               autoCorrect={false}
               style={[{ fontSize: 16 }, Platform.OS === 'ios' && styles.inputIOS]} 
               autoCapitalize='none'
               underlineColorAndroid={Colors.SecanderyColor}
               placeholder='Password'
               onChangeText={(t) => { this.setState({ password: t }); }} 
               defaultValue={password}   
               secureTextEntry     
             />
           </View>
           <View style={[styles.form]}>
             <Button
               disabled={((username.length < 2) || (password.length < 6))} 
               onPress={this.login} title='Login'
             />
           </View>
         </View>
       </KeyboardAvoidingView>
     </Container>
   );
 }
}
const styles = StyleSheet.create({
  inputIOS: { 
    borderColor: '#eaeaea',
    borderWidth: 1, 
    textAlign: 'center',
    borderRadius: 5,
    paddingVertical: 10, 
    paddingHorizontal: 5 },
  form: {
    marginBottom: Platform.OS === 'ios' ? 18 : 10,
  },
  // loginForm: { 
  //   marginTop: this.state.isPhoneX == true ? 200: 50,
  //   marginHorizontal: 40,
  // },
  container: { paddingTop: 50 },
  image: { width: 150, height: 150 },
});
export default LoginScreen;
