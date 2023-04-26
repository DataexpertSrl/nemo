import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FullWidthProduct } from 'src/app/models/product';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [
    trigger('SlideInOut', [
      transition(':enter', [
        style({ opacity: 1, transform: 'translateX(-100%)' }),
        animate('800ms', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('800ms', style({ opacity: 1, transform: 'translateX(-100%)' })),
      ]),
    ]),
    trigger('SlideInOutFaster', [
      transition(':enter', [
        style({ opacity: 1, transform: 'translateX(-100%)' }),
        animate('200ms', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 1, transform: 'translateX(-100%)' })),
      ]),
    ]),
    trigger('DropInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translatey(-100%)' }),
        animate('250ms', style({ opacity: 1, transform: 'translatey(0)' })),
      ]),
      transition(':leave', [
        animate('0ms', style({ opacity: 0, transform: 'translatey(-100%)' })),
      ]),
    ]),
    trigger('DropInOutScroll', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translatey(100%)' }),
        animate('250ms', style({ opacity: 1, transform: 'translatey(0)' })),
      ]),
      transition(':leave', [
        animate('250ms', style({ opacity: 0, transform: 'translatey(100%)' })),
      ]),
    ]),
  ]
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('toolbar') toolbar: any;
  sidebarOpen: boolean;
  isToolbarInView: boolean;
  toolbarHeight: number;
  filterSidebarOpen: boolean;
  die$ = new Subject()
  openProdFullWidth: boolean;
  fullWidthProd: FullWidthProduct | null;
  isLandingPage: boolean;
  loading: boolean;

  constructor(
    public sharedService: SharedService,
    private router: Router
  ) {
    this.sidebarOpen = false;
    this.isToolbarInView = true;
    this.toolbarHeight = 0;
    this.filterSidebarOpen = false;
    this.openProdFullWidth = false;
    this.fullWidthProd = null;
    this.isLandingPage = false;
    this.loading = false;
    this.router.events.subscribe({
      next: val => {
        if (val instanceof NavigationEnd) {
          this.IsLandingPage();
        }
      }
    })
  }

  ngOnInit(): void {
    this.CheckSideFilterOpen();
    this.CheckFullWdthProdOpen();
    this.IsLandingPage();
    this.ListenOnGenralLoading();
  }

  ngAfterViewInit(): void {
    if (this.toolbar && this.toolbar.nativeElement && this.toolbar.nativeElement.offsetHeight) {
      this.toolbarHeight = this.toolbar.nativeElement.offsetHeight;
    }
  }

  ngOnDestroy(): void {
    this.die$.next(null);
    this.die$.complete();
  }

  IsLandingPage(): void {
    if (window.location.pathname.includes('landingpage')) {
      this.isLandingPage = true;
    } else {
      this.isLandingPage = false;
    }
  }

  CloseSidebar(): void {
    this.sidebarOpen = false;
    if (this.filterSidebarOpen) {
      this.sharedService._filterOpen.next(false);
    }
  }

  OpenSidebar(): void {
    this.sidebarOpen = true;
  }

  @HostListener('window:scroll', ['$event'])
  CheckToolbarVisibility(event: any): void {
    if (window.pageYOffset > this.toolbarHeight + 50 && window.innerWidth >= 1000) {
      this.isToolbarInView = false;
    } else {
      this.isToolbarInView = true;
    }
  }

  CheckSideFilterOpen(): void {
    this.sharedService.filterOpen$.pipe(
      takeUntil(this.die$)
    ).subscribe({
      next: open => {
        this.filterSidebarOpen = open;
      }
    })
  }

  ApplyFilter(event: any): void {
    this.sharedService._filterApplied.next(event);
  }

  ScrollTop(): void {
    window.scroll(0, 0);
  }

  CheckFullWdthProdOpen(): void {
    this.sharedService.fullWitdhProduct$.pipe(takeUntil(this.die$))
    .subscribe({
      next: fwp => {
        if (fwp) {
          this.openProdFullWidth = true;
          this.fullWidthProd = fwp;
        } else {
          this.openProdFullWidth = false;
          this.fullWidthProd = null;
        }
      }
    });
  }

  CloseFwp(): void {
    this.sharedService._fullWitdhProduct.next(null);
  }

  isTemplate(toast: any): boolean {
		return toast.textOrTpl instanceof TemplateRef;
	}

  ListenOnGenralLoading(): void {
    this.sharedService.generalLoading$
    .pipe(takeUntil(this.die$))
    .subscribe({
      next: genLoading => {
        this.loading = genLoading;
      }
    });
  }
}
