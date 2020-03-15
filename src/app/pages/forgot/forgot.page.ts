import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LoadingController, NavController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {

  public forgotform: FormGroup;
  email: any;
  
  constructor(public router: Router,
    public service: ApiService,
    public ldngCrtl: LoadingController,
    public formBuilder: FormBuilder,
    private navCtrl: NavController
  ) {
    this.forgotform = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[A-Z0-9a-z._%+-]+@([A-Za-z0-9-]+.)+[A-Za-z]{2,4}$')])]
    });

  }

  ngOnInit() {
  }

  goto(p) {
    this.navCtrl.pop();
  }

  async change(val) {
    // console.log(val);
    this.service.presentLoading();
    this.service.forgetPass(val.email).subscribe(res => {
      this.service.hideLoading()
      console.log("=========  : ", res)
      if (res.status == '1') {
        this.service.presentAlert('Link sent successfully');
      } else {
        this.service.presentAlert('Enter valid email');
      }
    }, err => {
      this.service.hideLoading()
      this.service.presentAlert('Network connection error');
    });
  }
}
