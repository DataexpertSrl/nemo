import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./routes/homeModule/home.module').then(x => x.HomeModule)
  },
  {
    path: '#',
    loadChildren: () => import('./routes/homeModule/home.module').then(x => x.HomeModule)
  },
  {
    path: 'product',
    loadChildren: () => import('./routes/product/product.module').then(x => x.ProductModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./routes/user/user.module').then(x => x.UserModule)
  },
  {
    path: 'shopping',
    loadChildren: () => import('./routes/shopping/shopping.module').then(x => x.ShoppingModule)
  },
  {
    path: 'order',
    loadChildren: () => import('./routes/order/order.module').then(x => x.OrderModule)
  },
  {
    path: 'landingpage/:token',
    component: LandingPageComponent
  },
  {
    path: 'landingpage',
    component: LandingPageComponent
  },
  {
    path: 'payment',
    component: LandingPageComponent
  }
];
const routerOptions: ExtraOptions = {
  anchorScrolling: "enabled"
  //scrollPositionRestoration: "enabled"
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
