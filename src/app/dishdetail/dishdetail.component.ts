import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  // Plato mostrado en los detalles
  dish: Dish;
  errorMessage: string;
  // Ids de todos los platos almacenados del menu. Usado para la implementación "cutre"
  // de un ViewPager entre todos los platos
  dishIds: string[];
  prev: string; // previous dish id
  next: string; // next dish id

  // Modelo de formulario de un comentario
  commentForm: FormGroup;
  @ViewChild('fform') commentFormDirective;

  // Cadenas con los errores mostrados en cada campo del formulario. No hay errores para
  // "rating"
  formErrors = {
    'author': '',
    'comment': ''
  };

  // Mapeo de errores para cada campo. Cada tipo de error (required, minlenght, etc) almacena
  // un mensaje de error que se mostrará en el formulario
  validationMessages = {
    'author': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long.'
    },
    'comment': {
      'required': 'Comment is required'
    }
  };

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    @Inject('BaseURL') public BaseURL: String // Inyectamos el BaseURL desde el app.module en base al nombre del campo
  ) {
    this.createForm();
  }

  ngOnInit() {
    // Get all dish ids
    this.dishService.getDishIds()
      .subscribe(
        dishIds => this.dishIds = dishIds,
        errorMessage => this.errorMessage = errorMessage
      );

    // Nos suscribirmos a los params del routing que ha cargado la página, si estos cambian
    // (el dishId), se lanzará el observer y se refrescará el dish y el id previo/siguiente
    this.route.params
      .pipe(switchMap((params) => this.dishService.getDish(params['id'])))
      .subscribe(
        dish => {
          this.dish = dish;
          this.setPrevNext(dish.id);
        },
        errorMessage => this.errorMessage = errorMessage
      );
  }

  /**
   * Actualiza los índices de plato siguiente/previo para el manejo del ViewPager "casero"
   * @param dishId id del plato mostrado en los detalles
   */
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  /**
   * Realiza la creación del modelo de formulario de un comentario
   */
  createForm() {
    // Creamos el modelo del formulario con los campos: author, rating y comment
    this.commentForm = this.formBuilder.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      rating: [5, []], // Valor por defecto: 5
      comment: ['', [Validators.required]]
    });

    // Observamos los cambios del formulario para hacer la validación "en directo"
    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  /**
   * Llamado cuando el usuario pulsa el botón "Submit"
   */
  onSubmit() {
    // Mapeamos el modelo del formulario al modelo de datos. La fecha del comentario es creada en el
    // momento
    const comment: Comment = {
      rating: this.commentForm.get('rating').value,
      comment: this.commentForm.get('comment').value,
      author: this.commentForm.get('author').value,
      date: new Date().toISOString()
    };

    // Añadimos el nuevo comentario al plato
    this.dish.comments.push(comment);

    // Resteaoms el formulario a "pristine"
    this.commentFormDirective.resetForm();

    // Resteamos el formulario a su estado inicial
    this.commentForm.reset({
      rating: 5 // Valor por efecto
    });
  }

  /**
   * Realiza la validación de los campos del formulario. Si los valores de los campos no cumplen
   * con la validación requerida, se cargará y mostrarán los mensajes de errores que correspondan
   * @param data datos del formulario
   */
  onValueChanged(data?: any) {
    if (!this.commentForm) { return; } // Si el formulario no ha sido creado, no continuamos
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // limpia el mensaje de error previo (de haberlo)
        this.formErrors[field] = '';
        const control = this.commentForm.get(field);

        // El input ha de ser no null, modificado por el usuario y no válido
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          // Comprobamos los errores producidos en el input. Si se ha producido algún error, buscamos
          // en la colección de errores el mensaje asociado
          // Recordemos que el nombre de la propiedad del error corresponde con el nombre del campo
          // del mensaje
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

}
