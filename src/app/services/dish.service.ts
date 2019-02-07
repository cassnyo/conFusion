import { Injectable } from '@angular/core';
import { Dish} from '../shared/dish';
import { DISHES } from '../shared/dishes';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor() { }

  getDishes(): Promise<Dish[]> {
    // Como tenemos el resultado directamente, podemos usar Promise.resolve(). Si tuviesemos el error
    // tendríamos que usar Promise.reject()
    return Promise.resolve(DISHES);
  }

  getDish(id: string): Promise<Dish> {
    // .filter devuelve un array, retornamos la primera aparición que cumpla el filtro (solo habrá uno)
    return Promise.resolve(DISHES.filter((dish) => (dish.id === id))[0]);
  }

  getFeaturedDish(): Promise<Dish> {
    return Promise.resolve(DISHES.filter((dish) => (dish.featured))[0]);
  }

}
