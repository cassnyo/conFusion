import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import {expand, flyInOut} from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block; '
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {

  dish: Dish;
  dishErrorMessage: string;
  promotion: Promotion;
  promotionErrorMessage: string;
  leader: Leader;
  leaderErrorMessage: string;

  constructor(
    private dishService: DishService,
    private promotionService: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') public BaseURL: String // Inyectamos el BaseURL desde el app.module en base al nombre del campo
  ) { }

  ngOnInit() {
    this.dishService.getFeaturedDish()
      .subscribe(
        dish => this.dish = dish,
        dishErrorMessage => this.dishErrorMessage = dishErrorMessage
      );
    this.promotionService.getFeaturedPromotion()
      .subscribe(
        promotion => this.promotion = promotion,
        promotionErrorMessage => this.promotionErrorMessage = promotionErrorMessage
      );
    this.leaderService.getFeaturedLeader()
      .subscribe(
        leader => this.leader = leader,
        leaderErrorMessage => this.leaderErrorMessage = leaderErrorMessage
      );
  }

}
