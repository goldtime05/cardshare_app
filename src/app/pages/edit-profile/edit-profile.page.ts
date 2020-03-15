import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController, AlertController, NavController } from '@ionic/angular';
import { DatePicker } from '@ionic-native/date-picker/ngx';

declare var cordova: any;
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  @ViewChild("img_file1", { static: true }) profileImage: ElementRef;

  imgName: any = '';
  imageSrc: any = 'assets/img/default.png';

  months: any[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  selectedDate: boolean = false;

  userdata: any = {};
  fname: any;
  lname: any;
  email: any;
  pnumber: any;
  pregion: any;
  dob: any;
  birth: any;
  gender;
  filename: any;
  checkg: any = false;
  final: any;
  responsedata: any = [];

  constructor(public service: ApiService,
    private camera: Camera, private file: File,
    private webview: WebView,
    private actionSheetController: ActionSheetController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public router: Router,
    private transfer: FileTransfer,
    public alertController: AlertController,
    private toastController: ToastController,
    private plt: Platform,
    private filePath: FilePath,
    private navCtrl: NavController,
    private datePicker: DatePicker
  ) {
    this.selectedDate = false;
    this.userdata = localStorage.getItem('user');
    this.userdata = JSON.parse(this.userdata);
    this.getProfile();
  }

  ngOnInit() {
    this.gender = 'male';
  }

  getProfile() {
    this.service.presentLoading()
    this.service.getProfile(this.userdata.id).subscribe((resp) => {
      this.service.hideLoading();
      this.imgName = resp.result.file_name ? resp.result.file_name : "nouser.png";
      console.log("----------- ", resp.result);
      this.imageSrc = resp.result.image;
      this.fname = resp.result.first_name;
      this.lname = resp.result.last_name;
      this.email = resp.result.email;
      this.pnumber = resp.result.mobile;
      var dd = resp.result.dob.split('-', 3);
      console.log("----ddd------- ", dd);
      this.dob = this.months[dd[1] - 1] + " " + dd[2] + ", " + dd[0];
      this.birth = resp.result.dob;
      this.gender = resp.result.gender;
      if (this.gender == 'female') {
        this.checkg = true;
      } else {
        this.checkg = false;
      }
    }, error => {
      this.service.hideLoading();
      console.log("----------- ", error);
    })
  }

  toggleEditable(event) {
    if (event.target.checked) {
      document.getElementById('abc').innerText = 'Female';
      this.gender = 'female';
    } else {
      document.getElementById('abc').innerText = 'Male';
      this.gender = 'male';
    }
  }
  maleChecked() {
    this.gender = 'male';
  }
  femaleChecked() {
    this.gender = 'female';
  }
  //

  changeListener($event): void {
    if ($event.target.files[0]) { //214786048
      if ($event.target.files[0].size > 2097152) {
        alert("File size is so large.");
        this.profileImage.nativeElement.value = "";
        return;
      } else {
        this.filename = $event.target.files[0];        
        this.service.presentLoading()
        this.service.uploadImage(this.filename, 1).subscribe((res) => {
          var data = JSON.parse(JSON.stringify(res))          
          this.service.hideLoading()
          if (data.status == "1") {
            this.imgName = data.result.file_name;
            this.imageSrc = data.result.file_url;
          } else {
            this.service.presentToast("Cannot set the profile image now.")
          }
        }, err => {
          this.service.presentToast("Server connect error.")
          console.log("== err data === : ", err);
        })
      }
    }
  }


  // async selectImage() {
  //   const actionSheet = await this.actionSheetController.create({
  //     header: "Select Image source",
  //     buttons: [{
  //       text: 'Load from Library',
  //       handler: () => {
  //         this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  //       }
  //     },
  //     {
  //       text: 'Use Camera',
  //       handler: () => {
  //         this.takePicture(this.camera.PictureSourceType.CAMERA);
  //       }
  //     },
  //     {
  //       text: 'Cancel',
  //       role: 'cancel'
  //     }
  //     ]
  //   });
  //   await actionSheet.present();
  // }

  // takePicture(sourceType: PictureSourceType) {
  //   var options: CameraOptions = {      
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     sourceType: sourceType,
  //     saveToPhotoAlbum: false,
  //     correctOrientation: true,
  //     mediaType: this.camera.MediaType.PICTURE,
  //     allowEdit: true,
  //   };

  //   this.camera.getPicture(options).then((imageData) => {
  //     if (this.plt.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
  //       this.filePath.resolveNativePath(imageData)
  //         .then(filePath => {
  //           let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
  //           let currentName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
  //           this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
  //         });
  //     } else {
  //       var currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
  //       var correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
  //       this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
  //     }
  //     // this.resPath = this.webview.convertFileSrc(imageData);
  //     // console.log("===  photo file === : ", this.resPath);
  //   });

  // }

  // createFileName() {
  //   var d = new Date(),
  //     n = d.getTime(),
  //     newFileName = n + ".jpg";
  //   return newFileName;
  // }

  // pathForImage(img) {
  //   if (img === null) {
  //     return '';
  //   } else {
  //     this.resPath = this.webview.convertFileSrc(img);
  //     return this.file.dataDirectory + img;
  //   }
  // }

  // copyFileToLocalDir(namePath, currentName, newFileName) {
  //   this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
  //     let filePath = this.file.dataDirectory + newFileName;
  //     this.filename = newFileName;
  //     this.final = this.pathForImage(filePath);
  //   }, error => {
  //     this.presentToast('Error while storing file.');
  //   });
  // }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
  goto(p) {
    this.router.navigateByUrl(p);
  }
  goBack() {
    this.navCtrl.pop()
  }

  selectDate() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => {
        this.selectedDate = true;
        console.log('Got date: ', date)
        this.dob = this.months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
        this.birth = date;
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  async upload() {
    if (!this.pnumber.includes("+")) {
      alert("You have to input the region code with '+' symbol.")
      return;
    }
    const loading = await this.loadingCtrl.create({
      message: 'Please wait..'
    });
    await loading.present();

    var obj = {
      'image': this.imgName,
      'email': this.email,
      'dob': this.selectedDate ? this.birth.getFullYear() + "-" + (parseFloat(this.birth.getMonth()) + 1) + "-" + this.birth.getDate() : this.birth,
      'first_name': this.fname,
      'last_name': this.lname,
      'mobile': this.pnumber,
      'gender': this.gender,
      'user_id': this.userdata.id
    }

    console.log("==== update data ===== : ", obj)
    this.service.EditProfile(obj).subscribe(res => {
      loading.dismiss()
      console.log("==== update profile ===== : ", res)
      if (res.status == '1') {
        localStorage.setItem('user', JSON.stringify(res.result));
        this.service.presentToast('Profile Updated Successfully !!');
      } else {
        this.service.presentToast('Error while updating profile !!');
      }
    }, err => {
      loading.dismiss()
      console.log(err);
    });
  }
}
