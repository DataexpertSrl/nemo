import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Review } from 'src/app/models/product';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  @Input() review: Review | null = null;
  @Input() productId: string | null = null;
  @Output() reviewFeedBackChange = new EventEmitter<Review>();

  helpfulAdd: boolean;
  unHelpfulAdd: boolean;

  constructor() {
    this.helpfulAdd = false;
    this.unHelpfulAdd = false;
  }

  ngOnInit(): void {
    if (this.review && !this.review?.Helpful) {
      this.review.Helpful = 0;
    }
    if (this.review && !this.review?.Unhelpful) {
      this.review.Unhelpful = 0;
    }
  }

  HelpfulClick(): void {
    if (this.helpfulAdd && this.review?.Helpful && this.review?.Helpful > 0) {
      this.review.Helpful --;
      this.helpfulAdd = false;
    } else if (!this.helpfulAdd && !this.unHelpfulAdd && this.review?.Helpful !== undefined && this.review?.Helpful !== null) {
      this.review.Helpful ++
      this.helpfulAdd = true;
    }
    if (this.review) {
      this.reviewFeedBackChange.emit(this.review);
    }
  }

  UnhelpfulClick(): void {
    if (this.unHelpfulAdd && this.review?.Unhelpful && this.review?.Unhelpful > 0) {
      this.review.Unhelpful --;
      this.unHelpfulAdd = false;
    } else if (!this.unHelpfulAdd && !this.helpfulAdd && this.review?.Unhelpful !== undefined && this.review?.Unhelpful !== null) {
      this.review.Unhelpful ++
      this.unHelpfulAdd = true;
    }
    if (this.review) {
      this.reviewFeedBackChange.emit(this.review);
    }
  }
}
