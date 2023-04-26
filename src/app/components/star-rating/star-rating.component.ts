import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {
  @Input() rating: number = 0;
  @Input() maxRating: number = 5;
  @Input() icon: IconProp = ['fas', 'star'];
  @Input() editable: boolean = true;
  @Output() ratingChange = new EventEmitter<number>();

  ratinglist: boolean[];
  constructor() {
    this.ratinglist = [];
  }

  ngOnInit(): void {
    if (this.rating > this.maxRating) {
      for (let i = 1; i <= 5; i++) {
        this.ratinglist.push(false);
      }
    } else {
      for (let i = 1; i <= this.maxRating; i++) {
        if (i <= this.rating) {
          this.ratinglist.push(true);
        } else {
          this.ratinglist.push(false);
        }
      }
    }
  }

  Change(index: number): void {
    if (this.editable) {
      if (index >= 0 && index <= this.ratinglist.length -1) {
        if (this.ratinglist[index] !== undefined && this.ratinglist[index] !== null) {
          this.ratinglist[index] = !this.ratinglist[index];
          if (this.ratinglist[index] === true) {
            this.ChangeBackRecursive(index);
          } else {
            this.ChangeNextRecursive(index);
          }
        }
      }
    }
  }

  ChangeBackRecursive(index: number): void {
    if (index >= 0 && index <= this.ratinglist.length -1) {
      this.ratinglist[index] = true;
      this.ChangeBackRecursive(index - 1);
    } else {
      return;
    }
  }

  ChangeNextRecursive(index: number): void {
    if (index >= 0 && index <= this.ratinglist.length -1) {
      this.ratinglist[index ] = false;
      this.ChangeNextRecursive(index + 1);
    } else {
      return;
    }
  }
}
