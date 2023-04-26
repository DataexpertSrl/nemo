import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/filter';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Output() OpenSidebarEvent = new EventEmitter<void>();
  categories: Category[];
  accordionOpen?: number;
  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.categories = [];
  }

  ngOnInit(): void {
      this.getCategory();
  }

  OpenSidebar(): void {
    this.OpenSidebarEvent.emit();
  }

  getCategory(): void {
    this.categories = this.categoryService.getCategoriesHardCoded();
  }

  OpenClose(cat: Category): void {
    // if (this.categories[i] && this.categories[i].subcategory && this.categories[i].subcategory.length > 0) {
    //   if (this.accordionOpen !== undefined && this.accordionOpen !== null && this.accordionOpen === i) {
    //     this.accordionOpen = undefined;
    //   } else {
    //     this.accordionOpen = i;
    //   }
    // } else {
    //   if (this.categories[i] && this.categories[i].link && this.categories[i].link !== '') {
    //     this.NavigateToList(this.categories[i].link);
    //   }
    // }
  }

  NavigateToList(route: string | null): void {
    if (route) {
      this.OpenSidebar();
      this.router.navigate([route])
    }
  }
}
