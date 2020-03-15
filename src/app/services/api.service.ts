import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
};

// const apiUrl = "http://192.168.0.105/card_share/webservice";
// const apiUrl = "http://localmultitenancy.com/webservice";
// const apiUrl = "https://jamesrobert.000webhostapp.com/card_share/webservice";
// const apiUrl = "https://galatest.000webhostapp.com/webservice";
const apiUrl = "https://galaapp.com.au/webservice";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  loading;
  deviceID: any;

  countryCode: any;
  contactPhoneNumber: string;

  selectCountryCodeEvent: string = "select-code";
  selectContactEvent: string = "selected-contact"
  noSelectContactEvent: string = "no-selected-contact"

  stripePubKey = "pk_live_UxgOwwHy3LZE061sfAQ7amay00Hf337dPG";
  // stripePubKey = "pk_test_FyuDB58jDerCkT6NKnT9yZN000HyDeHuuw";

  private dataUrl: string = "assets/country.json"

  constructor(
    public http: HttpClient,
    public alertController: AlertController,
    public loadingctrl: LoadingController, public toastController: ToastController) {

  }

  getData(): Observable<any> {
    return this.http.get(this.dataUrl)
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      message: `<h4>${msg}</h4>`,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'middle'
    });
    toast.present();
  }

  async presentLoading() {
    this.loading = await this.loadingctrl.create({
      spinner: 'dots'
    });
    await this.loading.present();
  }

  hideLoading() {
    try {
      this.loadingctrl.dismiss();
    } catch (error) { }
  }

  login(data): Observable<any> {
    console.log(data);
    const url = `${apiUrl}/login?`;    
    return this.http.post(url + 'email=' + data.email + '&password=' + data.password + '&uid=' + data.uuid, '', httpOptions)    
  }

  forgetPass(mail): Observable<any> {
    const url = `${apiUrl}/forgot_password?`;
    return this.http.post(url + 'email=' + mail, '', httpOptions)
  }

  getProfile(id): Observable<any> {
    const url = `${apiUrl}/get_profile?`;
    return this.http.post(url + 'user_id=' + id, '', httpOptions);
  }

  getProfileFromPhone(phone): Observable<any> {
    const url = `${apiUrl}/get_profile_phone`;

    var form = new FormData();
    form.append("phone", phone);

    return this.http.post(url, form);
  }

  withoutImgsign(data): Observable<any> {
    const url = `${apiUrl}/signup`;

    var form = new FormData();
    form.append("image", "")
    form.append("email", data.email)
    form.append("password", data.password)
    form.append("dob", data.dob)
    form.append("first_name", data.first_name)
    form.append("last_name", data.last_name)
    form.append("mobile", data.mobile)
    form.append("gender", data.gender)

    return this.http.post(url, form);   
  }

  getCategorie(type): Observable<any> {
    const url = `${apiUrl}/get_sub_category?`;
    return this.http.post(url + 'category_id=' + type, '', httpOptions);
  }

  getMainCategories(): Observable<any> {
    const url = `${apiUrl}/get_category?`;
    return this.http.post(url, '', httpOptions);
  }

  getCategoryName(id): Observable<any> {
    const url = `${apiUrl}/get_category_name?`;
    return this.http.post(url + 'category_id=' + id, '', httpOptions);
  }

  getCardFromKind(kind): Observable<any> {
    const url = `${apiUrl}/get_card_detail?`;
    return this.http.post(url + 'card_kind=' + kind, '', httpOptions);
  }

  EditProfile(data): Observable<any> {
    const url = `${apiUrl}/update_profile`;

    var httpOption = {
      headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' })
    };

    console.log("===== ", data)
    var form = new FormData();
    form.append("first_name", data.first_name);
    form.append("last_name", data.last_name);
    form.append("email", data.email);
    form.append("mobile", data.mobile);
    form.append("gender", data.gender);
    form.append("dob", data.dob);   
    form.append("image", data.image);
    form.append("user_id", data.user_id);

    return this.http.post(url, form);

  }
  
  stripePayment(data): Observable<any> {
    const url = `${apiUrl}/stripePayment`;

    var httpOption = {
      headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' })
    };

    var form = new FormData();
    form.append("token", data.token);
    form.append("card_number", data.card_number);
    form.append("amount", data.amount);   
    form.append("email", data.email);
    form.append("user_id", data.user_id);  
    form.append("sender_id", data.sender_id);   
    form.append("receiver_id", data.receiver_id);
    form.append("card_id", data.card_id);  

    return this.http.post(url, form);
  }
  
  paypalPayment(data): Observable<any> {
    const url = `${apiUrl}/paypalPayment`;

    var httpOption = {
      headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' })
    };

    var form = new FormData();
    form.append("transaction_id", data.transaction_id);
    form.append("payment_state", data.payment_state);
    form.append("response_type", data.response_type);   
    form.append("amount", data.amount);
    form.append("user_id", data.user_id); 
    form.append("email", data.email);   
    form.append("date", data.date); 
    form.append("description", data.description); 
    form.append("sender_id", data.sender_id);   
    form.append("receiver_id", data.receiver_id);
    form.append("card_id", data.card_id) 

    return this.http.post(url, form);
  }

  sendCard(data): Observable<any> {
    const url = `${apiUrl}/add_card_details`;

    var httpOption = {
      headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' })
    };

    var form = new FormData();
    form.append("sender_id", data.sender_id);
    form.append("receiver_id", data.receiver_id);
    form.append("message", data.message);
    form.append("gift_amount", data.gift_amount);
    form.append("sender_email", data.sender_email);
    form.append("receiver_email", data.receiver_email);
    form.append("image1", data.image1);
    form.append("image2", data.image2);
    form.append("video", data.video);
    form.append("card_id", data.card_id);
    form.append("first_name", data.first_name);
    form.append("last_name", data.last_name);

    return this.http.post(url, form);
  }

  uploadImage(image, kind) {
    const url = `${apiUrl}/media_upload`;

    var form = new FormData();
    form.append("kind", kind);
    form.append("mediafile", image);

    return this.http.post(url, form);
  }

  getAllReceiveCards(phoneNumber) {
    const url = `${apiUrl}/get_allreceivecard`;

    var form = new FormData();
    form.append("phone", phoneNumber);
    
    return this.http.post(url, form);
  }

  getAllCollectable(phoneNumber) {    
    const url = `${apiUrl}/get_collectable_card`;

    var form = new FormData();
    form.append("phone", phoneNumber);
    
    return this.http.post(url, form);
  }

  getAllSentCards(userid) {    
    const url = `${apiUrl}/get_allsentcard`;

    var form = new FormData();
    form.append("sender_id", userid);
    
    return this.http.post(url, form);
  }

  sendEmail(fromEmail, username, message) {
    const url = `${apiUrl}/sendEmail`;

    var httpOption = {
      headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' })
    };

    var form = new FormData();
    form.append("email", fromEmail);
    form.append("username", username);
    form.append("message", JSON.stringify(message));

    return this.http.post(url, form);
  }

  updateUserData(phone) {    
    const url = `${apiUrl}/updateUserData`;

    var httpOption = {
      headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' })
    };

    var form = new FormData();
    form.append("phone", phone);

    return this.http.post(url, form);
  }

  sendContactMail(fromEmail, username, message) {
    const url = `${apiUrl}/sendContactEmail`;    

    var form = new FormData();
    form.append("email", fromEmail);
    form.append("username", username);
    form.append("message", JSON.stringify(message));

    return this.http.post(url, form);
  }
} 
