import { NgModule } from '@angular/core';
import {Plugins} from '@capacitor/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const {SplashScreen} = Plugins;

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'add-profile', loadChildren: () => import('../app/pages/add-profile/add-profile.module').then( m => m.AddProfilePageModule)},
  { path: 'card_detail', loadChildren: () => import('../app/pages/card-detail/card-detail.module').then( m => m.CardDetailPageModule)},  
  { path: 'checkout', loadChildren: () => import('../app/pages/checkout/checkout.module').then( m => m.CheckoutPageModule)},
  { path: 'contact', loadChildren: () => import('../app/pages/contact/contact.module').then( m => m.ContactPageModule)},
  { path: 'edit-profile', loadChildren: () => import('../app/pages/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)},
  { path: 'forgot', loadChildren: () => import('../app/pages/forgot/forgot.module').then( m => m.ForgotPageModule)},
  { path: 'home', loadChildren: () => import('../app/pages/home/home.module').then( m => m.HomePageModule)},
  { path: 'main', loadChildren: () => import('../app/pages/main/main.module').then( m => m.MainPageModule)},
  { path: 'mycard', loadChildren: () => import('../app/pages/mycard/mycard.module').then( m => m.MycardPageModule)},
  { path: 'profile', loadChildren: () => import('../app/pages/profile/profile.module').then( m => m.ProfilePageModule)},
  { path: 'received-card', loadChildren: () => import('../app/pages/received-card/received-card.module').then( m => m.ReceivedCardPageModule)},
  { path: 'summary', loadChildren: () => import('../app/pages/summary/summary.module').then( m => m.SummaryPageModule)},  
  { path: 'card-kind', loadChildren: './pages/card-kind/card-kind.module#CardKindPageModule' },
  { path: 'country-code', loadChildren: './pages/country-code/country-code.module#CountryCodePageModule' },
  { path: 'contacts-list', loadChildren: './pages/contacts-list/contacts-list.module#ContactsListPageModule' }, 
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  componentDidLoad()
  {
    SplashScreen.hide();
  }
 }
