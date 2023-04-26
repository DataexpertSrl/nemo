import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, forkJoin, Subject, takeUntil } from 'rxjs';
import { Category, Filter, Sort } from 'src/app/models/filter';
import { CategoryService } from 'src/app/services/category.service';
import { FilterService } from 'src/app/services/filter.service';
import { SharedService } from 'src/app/shared/shared.service';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, AfterViewInit, OnDestroy {

  die$ = new Subject();
  categories: Category[];
  sortBy: Sort[];
  accordionOpen: string[];
  disabled: boolean;

  loading: boolean;

  minValueBk = 0;
  maxValueBk = 1000;
  minValue: any = 0;
  maxValue: any = 1000;

  options: Options;

  constructor(
    private sharedService: SharedService,
    private filterService: FilterService,
    private sessionService: SessionService) {
      this.sortBy = [];
      this.categories = [];
      this.accordionOpen = [];
      this.loading = false;
      this.disabled = false;
      this.options = {
        floor: this.minValue,
        ceil: this.maxValue,
        disabled: this.loading,
        translate: (value: number, label: LabelType): string => {
          switch (label) {
            default:
              return "€" + value;
          }
        }
      }
  }

  ngOnInit(): void {
    this.GetFilter();
    this.CheckLodingProduct();
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.die$.next(null);
    this.die$.complete();
  }

  SetRangeOption(): void {
    this.options = {
      floor: this.minValue,
      ceil: this.maxValue,
      disabled: this.disabled,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          default:
            return "€" + value;
        }
      }
    }
  }

  GetFilter(): void {
    this.loading = true;
    forkJoin({
      range: this.filterService.GetRangePrice(),
      cat: this.filterService.GetCategories(),
      sort: this.filterService.GetSortBy()
    }).pipe(takeUntil(this.die$), finalize(() => this.loading = false))
    .subscribe({
      next: allRes => {
        if (allRes) {
          if (allRes.cat) {
            this.categories = allRes.cat.map(x => {x.checked = false; return x});
            this.sessionService.SaveItemOnStorage('Categories', JSON.stringify(allRes.cat));
          }
          if (allRes.sort) {
            this.sortBy = allRes.sort.map(x => {return {checked: false, property: x}});
            this.sessionService.SaveItemOnStorage('SortByList', JSON.stringify(allRes.sort));
          }
          if (allRes.range) {
            this.sessionService.SaveItemOnStorage('RangePrice', JSON.stringify(allRes.range));
            let min = allRes.range.minPrice !== undefined &&  allRes.range.minPrice !== null ?  allRes.range.minPrice : 0;
            let max = allRes.range.maxPrice !== undefined &&  allRes.range.maxPrice !== null ?  allRes.range.maxPrice : 0;

            if (min !== 0 && min % 1 !== 0) {
              min = min | 0;
            }
            if(max !== 0 && max % 1 !== 0) {
              max = (max | 0) + 1;
            }

            this.minValueBk = min;
            this.maxValueBk = max;

            this.minValue = JSON.parse(JSON.stringify(this.minValueBk));
            this.maxValue = JSON.parse(JSON.stringify(this.maxValueBk));
            this.SetRangeOption();
          }
          this.LoadFilterFromStorage();
        }
      }
    })
  }

  OpenClose(item: string): void {
    if (this.accordionOpen.includes(item)) {
      this.accordionOpen = this.accordionOpen.filter(a => a !== item);
    } else {
      this.accordionOpen.push(item);
    }
  }

  CheckSort(property: string): void {
    this.sortBy.map(x => x.checked = false);
    const selected = this.sortBy.find(x => x.property === property);
    if (selected && !selected.checked) {
      selected.checked = true;
    } else if (selected && selected.checked) {
      selected.checked = false;
    }
    this.ApplyFilter();
  }

  Check(id: string, isBrand: boolean): void {
    let selected: any = undefined;
    selected = this.categories.find(x => x.ecommerceCategoryId === id);

    if (selected && !selected.checked) {
      selected.checked = true;
    } else if (selected && selected.checked) {
      selected.checked = false;
    }
    this.ApplyFilter();
  }

  CloseFilter(): void {
    this.sharedService._filterOpen.next(false);
  }

  RangeChanged(): void {
    this.ApplyFilter()
  }

  ClearFilter(): void {
    this.minValue = JSON.parse(JSON.stringify(this.minValueBk));
    this.maxValue = JSON.parse(JSON.stringify(this.maxValueBk));

    this.categories.map(x => x.checked = false);
    this.ApplyFilter();
  }

  ApplyFilter(): void {

    const sortChecked = this.sortBy.find(x => x.checked) || null;
    let sort = null;
    if (sortChecked) {
      sort = this.sortBy.indexOf(sortChecked);
    }
    const filter: Filter = {
      PriceMin: this.minValue,
      PriceMax: this.maxValue,
      Sort: sort,
      Categories: this.categories.filter(c => c.checked).map(c => c.ecommerceCategoryId),
      Search: null,
      Skip: 0,
      Take: this.sharedService.apiTake
    };
    this.sharedService._filterApplied.next(filter);
    // localStorage.setItem('filters-applied', JSON.stringify(filter));
    this.sharedService.filtersSaved = filter;
  }

  LoadFilterFromStorage(): void {
    const filter = this.sharedService.filtersSaved;
    if (filter) {
      this.minValue = filter.PriceMin !== undefined && filter.PriceMin !== null ? filter.PriceMin : this.minValueBk;
      this.maxValue = filter.PriceMax !== undefined && filter.PriceMax !== null ? filter.PriceMax : this.maxValueBk;
      if (this.sortBy) {
        this.sortBy.map(x => x.checked = false);
        if (filter.Sort && this.sortBy.length > filter.Sort) {
          const sortchecked = this.sortBy[filter.Sort]
          if (sortchecked) {
            sortchecked.checked = true;
          }
        }
      }
      if (this.categories) {
        this.categories.forEach(cat => {
          if (filter.Categories) {
            cat.checked = filter.Categories.includes(cat.ecommerceCategoryId);
          }
        });
      }
    }
  }

  CheckLodingProduct(): void {
    this.sharedService.loadingProducts$
      .pipe(takeUntil(this.die$))
      .subscribe({
        next: load => {
          this.disabled = load;
        },
        error: e => {
          this.disabled = false;
        }
      })
  }
}
