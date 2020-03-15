import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClientModule } from '@angular/common/http'; 
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { environment } from '../environments/environment';
import { CurrencyPipe } from "@angular/common";
import { PaypalPageModule } from "../app/pages/paypal/paypal.module";
import { DatePicker } from '@ionic-native/date-picker/ngx';
// import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Stripe } from '@ionic-native/stripe/ngx';
import { PayPal } from '@ionic-native/paypal/ngx';
import { VideoPlayer } from '@ionic-native/video-player/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';
import { CountryCodePageModule } from "../app/pages/country-code/country-code.module";
import { ContactsListPageModule } from "../app/pages/contacts-list/contacts-list.module";
import { AddProfilePageModule } from "../app/pages/add-profile/add-profile.module";
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { customAlertEnter } from './customAlertEnter';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot({alertEnter: customAlertEnter}),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PaypalPageModule,
    NgxIonicImageViewerModule,
    ContactsListPageModule,
    AddProfilePageModule,
    CountryCodePageModule,
    SuperTabsModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    FileTransfer,
    Camera,
    WebView,
    FilePath,
    Stripe,
    Base64,
    GooglePlus,
    DatePicker,
    CurrencyPipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // UniqueDeviceID,
    Uid,
    AndroidPermissions,
    OneSignal,
    PayPal,
    VideoPlayer,
    Contacts,
    InAppBrowser,
    SpinnerDialog,
    DocumentViewer,
    NativeStorage,
    EmailComposer
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
