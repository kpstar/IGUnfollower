package com.itachi;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.dooboolab.RNIap.RNIapPackage;
import com.microsoft.codepush.react.CodePush;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.sbugert.rnadmob.RNAdMobPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import java.util.Arrays;
import java.util.List;
import static com.itachi.Utils.decryptIt;

public class MainApplication extends Application implements ReactApplication {
  public static Boolean isDebug = BuildConfig.DEBUG;
  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }
    
        @Override
        public boolean getUseDeveloperSupport() {
          return isDebug;
        }    

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNIapPackage(),
            new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), 
            getApplicationContext(),isDebug),
            new RNDeviceInfo(),
            new RNAdMobPackage(),
            new ReactNativeRestartPackage(),
            new VectorIconsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
  public void runApp(){
    if (!getPackageName().equals(decryptIt("JbAtuvOITob+ZUzaveJlPA=="))){
      String error = null;
      error.getBytes();
    }
  }
}
