import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { MyAccountComponent } from './myaccount/myaccount.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserLoggedInGuard } from 'src/app/guards/user-loggedin.guard';
import { OrderListComponent } from './order-list/order-list.component';
import { ScrollingModule } from '@angular/cdk/scrolling';


const routes: Routes = [
  {
    path: 'Login',
    component: LoginComponent
  },
  {
    path: 'MyAccount',
    component: MyAccountComponent,
    canActivate: [UserLoggedInGuard]
  }
];

@NgModule({
  declarations: [
    LoginComponent,
    MyAccountComponent,
    OrderListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
