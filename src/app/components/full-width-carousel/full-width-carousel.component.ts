import { AfterViewInit, Component, HostListener, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { FullWidthProduct } from 'src/app/models/product';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-full-width-carousel',
  templateUrl: './full-width-carousel.component.html',
  styleUrls: ['./full-width-carousel.component.scss']
})
export class FullWidthCarouselComponent implements OnInit, OnDestroy, AfterViewInit{

  die$ = new Subject();
  @Input() fwp?: FullWidthProduct = undefined;
  selectedImage?: string;
  basePath: string;

  constructor(
    private sharedService: SharedService,
    private renderer: Renderer2,
    private translate: TranslateService
  ) {
    this.selectedImage = undefined;
    this.basePath = sharedService.basePath;
  }

  ngOnInit(): void {
    if (this.fwp && this.fwp.Product && this.fwp.SelectedImage !== undefined && this.fwp.SelectedImage !== null) {
      this.selectedImage = this.fwp.Product.imagesUrl[this.fwp.SelectedImage];
    }
  }

  ngAfterViewInit(): void {
    this.ResizeImage(null);
  }

  ngOnDestroy(): void {
  }

  Close(): void {
    this.sharedService._fullWitdhProduct.next(null);
  }

  @HostListener('window:resize', ['$event'])
  ResizeImage(event: any) {
    const image = this.renderer.selectRootElement('#resize-image');
    if (window.innerWidth < 850) {
      this.renderer.setStyle(image, 'width', `calc(${window.innerWidth}px - 3rem)`);
      this.renderer.setStyle(image, 'height', `calc(${window.innerWidth}px - 3rem)`);
    } else {
      this.renderer.setStyle(image, 'width', `100%`);
      this.renderer.setStyle(image, 'height', `100%`);
    }
  }

  GetNumDesc(): string {
    let desc = '';
    if (this.fwp && this.fwp.Product && this.fwp.Product.imagesUrl && this.fwp.SelectedImage !== undefined && this.fwp.SelectedImage !== null) {
      desc = desc + (this.fwp.SelectedImage + 1) + ' ' + this.translate.instant('Shared.Of') + ' ' + this.fwp.Product.imagesUrl.length;
    }
    return desc
  }

  NextImage(): void {
    if (this.fwp && this.fwp.Product && this.fwp.Product.imagesUrl && this.fwp.SelectedImage !== undefined && this.fwp.SelectedImage !== null) {
      let index = this.fwp.SelectedImage;
      if (index !== undefined && index !== null) {
        if ((index + 1) > this.fwp.Product.imagesUrl.length - 1) {
          index = 0;
        } else {
          index = index + 1;
        }
      }
      this.fwp.SelectedImage = index;
      this.selectedImage = this.fwp.Product.imagesUrl[index];
    }
  }

  PrevImage(): void {
    if (this.fwp && this.fwp.Product && this.fwp.Product.imagesUrl && this.fwp.SelectedImage !== undefined && this.fwp.SelectedImage !== null) {
      let index = this.fwp.SelectedImage;
      if (index !== undefined && index !== null) {
        if ((index - 1) < 0) {
          index = this.fwp.Product.imagesUrl.length - 1;
        } else {
          index = index - 1;
        }
      }
      this.fwp.SelectedImage = index;
      this.selectedImage = this.fwp.Product.imagesUrl[index];
    }
  }
}
