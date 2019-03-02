import React from 'react';
import { Platform } from 'react-native';
import {
  AdMobBanner,
  AdMobInterstitial,
} from 'react-native-admob';

const ads = Platform.select({
  android: {
    banner: 'ca-app-pub-5534203296989402/9886259155',
    inter: 'ca-app-pub-5534203296989402/1600165900',
    type: 'smartBanner',
  },
  ios: {
    banner: 'ca-app-pub-5534203296989402/1321600708',
    inter: 'ca-app-pub-5534203296989402/3345128816',
    type: 'smartBanner',
  },
});
export const InterShow = () => {
  // Display an interstitial
  AdMobInterstitial.setAdUnitID(ads.inter);
  AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
};
export const Banner = () => (
  <AdMobBanner
    adSize={ads.type}
    adUnitID={ads.banner}
    // onAdFailedToLoad={error => console.error(error)}
  />
);
