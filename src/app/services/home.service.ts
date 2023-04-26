import { Injectable } from '@angular/core';
import { Slide } from '../models/slider';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor() { }

  GetHomeSlide(): Slide[] {
    const slides: Slide[] = [];
    const slide1: Slide = {
      id: 1,
      link: undefined,
      src: '/assets/images/home-slider/slide-1.jpg',
      subTitle: 'seasonal picks',
      title: 'Get All <br/> The Good Stuff',
      linkTitle: 'Discover more',
      alt: 'Slide 1',
      titleColor: '#333333'
    }
    const slide2: Slide = {
      id: 2,
      link: undefined,
      src: '/assets/images/home-slider/slide-2.jpg',
      subTitle: 'all at 50% off',
      title: 'The Most Beautiful <br/> Novelties In Our Shop',
      linkTitle: 'Shop now',
      alt: 'Slide 2',
      titleColor: '#ffffff'
    }
    slides.push(slide1);
    slides.push(slide2);
    return slides;
  }
}
