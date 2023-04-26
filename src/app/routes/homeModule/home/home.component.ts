import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { SlidesOutputData } from 'ngx-owl-carousel-o';
import { finalize, Subject, takeUntil } from 'rxjs';
import { Filter } from 'src/app/models/filter';
import { Product } from 'src/app/models/product';
import { Slide } from 'src/app/models/slider';
import { HomeService } from 'src/app/services/home.service';
import { ProductService } from 'src/app/services/product.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('parent', [
      transition(':enter', [])
    ]),
    trigger('SlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50%)' }),
        animate('250ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0%)' }),
        animate('250ms', style({ opacity: 0, transform: 'translateY(50%)' })),
      ]),
    ]),
    trigger('FadeInOut', [
      transition(':enter', [
        style({ opacity: 0, 'width' : '10%', 'height': '10%'}),
        animate('450ms', style({ opacity: 1, 'width' : '20%', 'height': '20%' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, 'width' : '20%', 'height': '20%'}),
        animate('450ms', style({ opacity: 0, 'width' : '10%', 'height': '10%' })),
      ]),
    ]),
  ]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  slides: Slide[];
  activeSlides: SlidesOutputData;
  productsList: Product[]
  overProduct?: number;
  isPaused: boolean;
  loading: boolean;

  die$ = new Subject();

  constructor(
    private homeService: HomeService,
    private sanitizer: DomSanitizer,
    private productService: ProductService,
    private sharedService: SharedService,
  ) {
    this.slides = [];
    this.activeSlides = {};
    this.productsList = [];
    this.isPaused = true;
    this.loading = false;
  }

  ngOnInit(): void {
    this.GetAllSlide();
    this.GetAllProduct();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isPaused= false;
    }, 1000);
  }

  ngOnDestroy(): void {
    this.die$.next(null);
    this.die$.complete();
    this.productsList = [];
  }

  GetAllSlide() {
    this.slides = this.homeService.GetHomeSlide();
  }

  getData(data: SlidesOutputData) {
    this.activeSlides = data;
  }

  ResolveColor(color?: string): SafeStyle {
    if (!color) {
      color = '#000000';
    }
    let fontColor = '';
    fontColor = `color: ${color}`;

    return this.sanitizer.bypassSecurityTrustStyle(`${fontColor};`);
  }

  GetAllProduct() {
    this.sharedService._loadingProducts.next(true);
    this.loading = true;
    const filter: Filter = JSON.parse(JSON.stringify(this.sharedService.filterEmpty));
    filter.Take = 8;
    filter.Sort = 2;
    this.productService.GetProduct(filter)
    .pipe(takeUntil(this.die$), finalize(() => {
      this.sharedService._loadingProducts.next(false);
      this.loading = false;
    }))
    .subscribe({
      next: res => {
        if (res) {
          this.productsList = res.products.map(x => {x.visible = true; return x});
        }
      }
    })
  }

  ApplyFilter(): void {
    this.sharedService._filterApplied.pipe(takeUntil(this.die$))
    .subscribe({
      next: filter => {
        if (filter) {
        }
      }
    })
  }
}
