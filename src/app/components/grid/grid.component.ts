import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, Renderer2, SimpleChanges, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { Category } from 'src/app/models/filter';
import { Product } from 'src/app/models/product';
import { CategoryService } from 'src/app/services/category.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  animations: [
    trigger('parent', [
      transition(':enter', [])
    ]),

    trigger('FadeInOut', [
      transition(':enter', [
        style({ opacity: 0, 'width': '5%', 'height': '5%' }),
        animate('450ms', style({ opacity: 1, 'width': '20%', 'height': '20%' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, 'width': '20%', 'height': '20%' }),
        animate('450ms', style({ opacity: 0, 'width': '5%', 'height': '5%' })),
      ]),
    ]),
  ]
})
export class GridComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy{
  @Input() productsList: Product[] = [];
  @Input() previewMode: boolean = false;
  @Input() loading: boolean = false;
  @Input() loadingMoreProduct: boolean = false;
  @Input() hasMoreProduct: boolean = false;
  @Output() loadMoreProduct = new EventEmitter<void>();

  @ViewChildren('scrollable-content') elements?: QueryList<any>;

  activeShortCut?: string;
  categories: Category[];
  sortBy: any[];
  overProduct?: number;
  itemSize: number;
  die$ = new Subject();
  smallWidth: boolean;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.activeShortCut = undefined;
    this.categories = [];
    this.sortBy = [];
    this.itemSize = 365;
    this.smallWidth = false;
  }

  ngOnInit(): void {
    let cat = this.categoryService.getCategoriesHardCoded();
    if (cat) {
      this.categories = cat.filter(x => x.name !== 'Home' && x.name !== 'Products');
    }
    this.onResize(null);
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnDestroy(): void {
    this.die$.next(null);
    this.die$.complete();
  }

  ShortCutFilter(ecommerceCategoryId: string): void {
    if (this.productsList) {
      if (this.activeShortCut != ecommerceCategoryId) {
        this.activeShortCut = ecommerceCategoryId;
        this.productsList.forEach(p => {
          if (p.sourceCategories[ecommerceCategoryId]) {
            p.visible = true;
          } else {
            p.visible = false;
          }
        })
      } else {
        this.activeShortCut = undefined;
        this.productsList.forEach(p => {
          p.visible = true;
        })
      }
    }
  }

  OpenFilterSidebar(): void {
    this.sharedService._filterOpen.next(true);
  }

  MoreProduct(): void {
    if (this.previewMode) {
      this.router.navigate(['/product/list/all'])
    } else {
      this.loadMoreProduct.emit();
    }
  }

  SomeVisible(): boolean {
    return this.productsList.some(x => x.visible);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if(window.innerWidth > 768) {
      this.smallWidth = false
    } else {
      this.smallWidth = true;
    }
  }

}
