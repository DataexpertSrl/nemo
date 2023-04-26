import { NgModule } from '@angular/core';
import { NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from  '@fortawesome/free-brands-svg-icons'
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { GridComponent } from '../components/grid/grid.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { LoaderComponent } from '../components/loader/loader.component';
import { StarRatingComponent } from '../components/star-rating/star-rating.component';
import { ReviewComponent } from '../components/review/review.component';
import { GridCardComponent } from '../components/grid-card/grid-card.component';
import { RecommendedComponent } from '../components/recommended/recommended.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { QuantityButtonComponent } from '../components/quantity-button/quantity-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderStatusBadgeComponent } from '../components/order-status-badge/order-status-badge.component';
import { VirtualScrollerModule } from '@iharbeck/ngx-virtual-scroller';
import { PasswordInputComponent } from '../components/password-input/password-input.component';

@NgModule({
  declarations: [
    GridComponent,
    LoaderComponent,
    StarRatingComponent,
    ReviewComponent,
    GridCardComponent,
    RecommendedComponent,
    QuantityButtonComponent,
    OrderStatusBadgeComponent,
    PasswordInputComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    HttpClientModule,
    FontAwesomeModule,
    TranslateModule,
    NgxSliderModule,
    CarouselModule,
    FormsModule,
    NgbToastModule,
    VirtualScrollerModule,
    ReactiveFormsModule
  ],
  exports: [
    NgbModule,
    FontAwesomeModule,
    TranslateModule,
    GridComponent,
    TranslateModule,
    NgxSliderModule,
    LoaderComponent,
    StarRatingComponent,
    ReviewComponent,
    RecommendedComponent,
    CarouselModule,
    QuantityButtonComponent,
    OrderStatusBadgeComponent,
    VirtualScrollerModule,
    PasswordInputComponent
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [SharedModule]
})
export class SharedModule {
  constructor(
    library: FaIconLibrary
  ) {
    library.addIconPacks(fas, far, fab);
  }
}
