import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import {expand, flyInOut} from '../animations/app.animation';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block; '
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class MenuComponent implements OnInit {

  dishes: Dish[];
  errorMessage: string;

  constructor(
    private dishService: DishService,
    @Inject('BaseURL') public BaseURL: String // Inyectamos el BaseURL desde el app.module en base al nombre del campo
  ) { }

  ngOnInit() {
    this.dishService.getDishes()
      .subscribe(
        dishes => this.dishes = dishes,
        errorMessage => this.errorMessage = errorMessage
      );
  }

}
