import React from 'react';
import { Platform } from 'react-native';
import * as RNIap from 'react-native-iap';

const skuIds = Platform.select({
  android: [
    'com.detectunfollowers.app.full_version',
    'com.detectunfollowers.app.year_full_version'
  ],
  ios: [
    'com.detectunfollowers.app.full_version',
    'com.detectunfollowers.app.year_full_version'
  ],
});
async function getCurrentSubscription() {
    try {
        RNIap.initConnection();
        const products = await RNIap.getAvailablePurchases();
        let proLists = products.map(x => x.productId);
        proLists = proLists.filter((val, id, array) => {
            return array.indexOf(val) == id;  
        });
        if (proLists.includes(skuIds[0]) || proLists.includes(skuIds[1])) {
            return 'full';
        }
        return 'none';
    } catch (err) {
        console.log(err);
        return 'none';
    }
};

async function buySubscription(index) {
    try {
        let product = await RNIap.getProducts(skuIds);
        if (product) {
            let purchase = await RNIap.buySubscription(skuIds[index]);
            RNIap.finishTransaction();
            return purchase;
        }
    } catch(err) {
        alert(err);
        return null;
    }
}

export default {
    getCurrentSubscription,
    buySubscription,
}