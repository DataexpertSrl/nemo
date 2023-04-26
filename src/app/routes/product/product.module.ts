import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'list/:catFilterId',
    component: ProductListComponent
  },
  {
    path: 'detail/:id',
    component: ProductDetailComponent
  }
];

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgxImageZoomModule,
    FormsModule
  ]
})
export class ProductModule { }
