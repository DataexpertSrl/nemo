import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { Filter } from 'src/app/models/filter';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  productsList: Product[]
  loading: boolean;
  die$ = new Subject();
  hasMoreProduct: boolean;
  loadingMoreProduct: boolean;

  @Input() previewMode: boolean = false;

  constructor(
    private productService: ProductService,
    private sharedService: SharedService,
    private route: ActivatedRoute
  ) {
    this.productsList = [];
    this.loading = false;
    this.hasMoreProduct = false;
    this.loadingMoreProduct = false;
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.ListenFilterApplied();
    this.route.paramMap.pipe(takeUntil(this.die$)).subscribe(paramMap => {
      const catFilterId = paramMap.get('catFilterId');
      if (catFilterId && catFilterId !== 'all') {
        this.ApllyCategoryFilter(catFilterId);
      } else {
        this.ApllyCategoryFilter(null);
      }

    });
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.die$.next(null);
    this.die$.complete();
    this.productsList = [];
  }

  GetAllProduct(filter: Filter | null, refreshList: boolean = true): void {
    this.sharedService._loadingProducts.next(true);
    if (refreshList) {
      this.loading = true;
    } else {
      this.loadingMoreProduct = true;
    }
    this.productService.GetProduct(filter)
    .pipe(takeUntil(this.die$), finalize(() => {
      this.sharedService._loadingProducts.next(false);
      this.loading = false;
      this.loadingMoreProduct = false;
    }))
    .subscribe({
      next: res => {
        if (res) {
          if (refreshList) {
            this.productsList = res.products.map(x => {x.visible = true; return x});
          } else {
            this.productsList = this.productsList?.concat(res.products.map(x => {x.visible = true; return x}));
          }
          this.hasMoreProduct = res.productsNumber && this.productsList && this.productsList.length < res.productsNumber ? true : false
        }
      }
    });
  }

  ListenFilterApplied(): void {
    this.sharedService._filterApplied.pipe(takeUntil(this.die$))
    .subscribe({
      next: filter => {
        if (filter) {
          this.GetAllProduct(filter);
        }
      }
    })
  }

  ApllyCategoryFilter(catId: string | null) {
    let filter = this.sharedService.filtersSaved;
    if (catId) {
      filter = JSON.parse(JSON.stringify(this.sharedService.filterEmpty));
      if (filter) {
        filter.Skip = 0;
        filter.Categories.push(catId);
      }
    } else {
      if (!filter) {
        filter = this.sharedService.filterEmpty;
      } else {
        filter.Skip = 0;
        filter.Categories = [];
      }
    }

    this.sharedService.filtersSaved = filter;
    this.sharedService._filterApplied.next(filter);
  }

  MoreProduct(): void {
    if (this.sharedService.filtersSaved) {
      this.sharedService.filtersSaved.Skip = this.sharedService.filtersSaved.Skip + this.sharedService.filtersSaved.Take;
    }
    this.GetAllProduct(this.sharedService.filtersSaved, false);
  }
}
