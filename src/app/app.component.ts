import { Component, ViewChildren, QueryList } from '@angular/core';

import { Platform, NavController, IonRouterOutlet, ToastController } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { ApiService } from './services/api.service';
import { Plugins } from '@capacitor/core';

const { SplashScreen } = Plugins;

@Component({
  selector: 'app-root', 
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  signal_app_id:string="ad8452ad-32d5-4492-b132-aa8b62ad08e3";
  firebase_id: string = "1057947635706";

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  componentDidLoad() {
    SplashScreen.hide();
  }

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private router: Router,
    private toast: ToastController,
    private oneSignal: OneSignal,
    private service: ApiService
  ) {
    
    this.initializeApp();
    this.backButtonEvent()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      

      this.oneSignal.getTags().then((value) => {
        console.log('Tags Received: ' + JSON.stringify(value));
      });
      this.oneSignal.startInit(this.signal_app_id, this.firebase_id);

      this.oneSignal.getIds().then(data => {
        console.log("Playerid:" + data.userId);
        // localStorage.setItem("deviceId", data.userId);
      //  // this.services.playerid = data.userId;
        this.service.deviceID = data.userId;
      });

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

      this.oneSignal.handleNotificationReceived().subscribe((res) => {
        // do something when notification is received
        console.log(res);

       // this.onPushReceived(res.payload);

      });

      this.oneSignal.handleNotificationOpened().subscribe((res) => {
        // do something when a notification is opened
        console.log(res);

      });

      this.oneSignal.endInit();
      this.oneSignal.setSubscription(true);

      let user = localStorage.getItem('user')
      if (user) this.navCtrl.navigateRoot('/main');
      else this.navCtrl.navigateRoot('/home')
    });
  }

  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()) {
          outlet.pop();
        } else if (this.router.url === '/main' || this.router.url === '/home') {
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            // this.platform.exitApp(); // Exit from app
            navigator['app'].exitApp(); // work for ionic 4
          } else {
            this.toast.create({
              message: 'Press back again to exit App.',
              duration: 2000,
              position: "bottom"
            }).then(tos => {
              tos.present()
            });            
            this.lastTimeBackPress = new Date().getTime();
          }
        }
      });
    });
  }  
}
