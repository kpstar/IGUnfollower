import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import { View, Container, Text } from '../components/commons';
import Purchases from '../components/Purchase';
import { Button, Label } from 'native-base';

export default class Purchase extends Component {

    constructor(props){
        super(props)
        this.state = {
            receipt: '',
        }
    }

    onPrivacyTerms(index) {
        let url = 'https://www.t-mobileg1.com/terms-of-use/';
        if (index > 0) {
            url = 'https://www.t-mobileg1.com/privacy-policy/';
        }
        Linking.openURL(url);
    }

    goToNext() {
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'Home' }),
            ],
          }));
    }

    async onUpgrade() {
        let purchase = await Purchases.buySubscription(0);
        try {
            this.setState({ receipt: purchase.transactionReceipt }, () => this.goToNext());
        } catch (err) {
            console.log(err);
        }
    }

    async onUpgradeForYear() {
        let purchase = await Purchases.buySubscription(1);
        try {
            this.setState({ receipt: purchase.transactionReceipt }, () => this.goToNext());
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <View style={styles.view}>
                    <Label style={styles.label}>Upgrade</Label>
                </View>
                <TouchableOpacity style={styles.close} onPress={() => this.props.navigation.goBack()}>
                    <Image style={styles.image} source={require('../close.png')}></Image>
                </TouchableOpacity>
                <View style={styles.viewLabel}>
                    <Label style={{fontWeight: 'bold'}}>then 2.99USD/month</Label>
                    <Label style={{fontWeight: 'bold', marginTop: 10}}>then 10.99USD/year</Label>
                    <Label style={{marginTop: 30}}>- No Ads!</Label>
                    <Label style={{marginBottom: 30}}>- Full Version</Label>
                    <Button style={styles.buttonOne} onPress={this.onPrivacyTerms.bind(this,0)}><Text style={styles.text}>Terms of Service</Text></Button>
                    <Button style={styles.buttonOne} onPress={this.onPrivacyTerms.bind(this, 1)}><Text style={styles.text}>Privacy Policy</Text></Button>
                    <Button onPress={this.onUpgrade.bind(this)} active style={styles.buttontwo}><Text style={styles.textThree}>Upgrade (1 month)</Text></Button>
                    <Button success onPress={this.onUpgradeForYear.bind(this)} active style={styles.buttontwos}><Text style={styles.textThree}>Upgrade (1 year)</Text></Button>
                    <Label style={styles.labeltwo}>Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period. Payment will be charged to iTunes Account at confirmation of purchase. Account will be charged for renewal within 24-hours prior to the end of the current period, and identify the cost of the renewal. The user may manage subscriptions and auto-renewal may be turned off by going to the user's Account Settings after purchase. Any unused portion of the free trial period, if offered will be forfeited when the user purchases a subscription to that publication, where applicable</Label>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    view:{
        marginTop: 50
    },
    close: {
        position: 'absolute',
        top: 30,
        right: 20
    },
    image: {
        width: 25,
        height: 30
    },
    viewLabel: {
        width: responsiveWidth(100) -20,
        left: 10,
        marginTop: 30,
        alignItems: 'flex-start',
    },
    price: {
        fontSize: 25,
    },
    label:{
        fontSize: 40,
        textAlign: 'center',
        color: '#000000',
    },
    labeltwo: {
        textAlign: 'center',
        color: '#b2b2b2',
        fontSize: 12,
    },
    text: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 13,
        textAlign: 'center',
    },
    textTwo: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    textThree: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonOne: {
        width: responsiveWidth(90),
        left: responsiveWidth(5) -10,
        alignItems: 'center',
        height: 30,
        justifyContent: 'center',
        marginBottom: 10,
    },
    buttontwo: {
        width: responsiveWidth(90),
        left: responsiveWidth(5) -10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    buttontwos: {
        width: responsiveWidth(90),
        left: responsiveWidth(5) -10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    buttonThree: {
        width: responsiveWidth(60),
        left: responsiveWidth(20) -10,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        marginBottom: 10,
    }
});