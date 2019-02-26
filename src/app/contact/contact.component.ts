import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Feedback, ContactType} from '../shared/feedback';
import {flyInOut} from '../animations/app.animation';
import {FeedbackService} from '../services/feedback.service';
import {delay} from 'rxjs/operators';
import {pipe} from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block; '
  },
  animations: [
    flyInOut()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  contactType = ContactType;
  @ViewChild('fform') feedbackFormDirective;
  errorMessage: string;
  loading: boolean;
  feedback: Feedback;

  // Array de strings que contendrá todos los mensajes de error correspondientes
  // a cada input
  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  // Mensajes de validación mostrados en el formulario. Tenemos un elemento por cada input
  // y por cada input los errores que pueden producirse. Los nombres de estos errores coinciden
  // con el nombre del Validator al que corresponden
  validationMessages = {
    'firstname': {
      'required': 'First name is required.',
      'minlength': 'First name must be at least 2 characeters long.',
      'maxlength': 'First name must cannot be more than 25 characters long.'
    },
    'lastname': {
      'required': 'Last name is required.',
      'minlength': 'Last name must be at least 2 characeters long.',
      'maxlength': 'Last name must cannot be more than 25 characters long.'
    },
    'telnum': {
      'required': 'Telephone number is required.',
      'pattern': 'Tel. number must contain only numbers.',
    },
    'email': {
      'required': 'Email is required.',
      'email': 'Email not in the valid format.'
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private feedbackService: FeedbackService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.loading = false;
  }

  createForm() {
    // Defiminimos el modelo de formulario de feedback
    this.feedbackForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [0, [Validators.required, Validators.pattern]], // El pattern se declara en el template
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    // Observamos los cambios de valor del formulario con este Observable
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // resetea los mensales de validación del formulario
  }

  onSubmit() {
    // Copiamos el valor del modelo de formulario (FormGroup) a un modelo de datos (Feedback)
    // Esto podemos hacerlo porque ambos modelos son idénticos (mismos atributos), si fuesen diferentes
    // tendríamos que mapear cada atributo a mano

    this.postFeedback(this.feedbackForm.value);
    this.resetForm();
  }

  postFeedback(newFeedback: Feedback) {
    this.loading = true;
    this.feedbackService.postFeedback(newFeedback)
      .subscribe(
        feedback => {
          this.loading = false;
          this.feedback = feedback;
        },
        errorMessage => {
          this.loading = false;
          this.errorMessage = errorMessage;
        }
      );
  }

  resetForm() {
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    }); // Reseteamos todo el formulario proporcionando un nuevo modelo de formulario con el que setear valores
    this.feedbackFormDirective.resetForm(); // Nos aseguramos que reseteamos el formulario al estado "pristine"
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) {
      return;
    } // Si el formulario no ha sido creado, no continuamos
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // limpia el mensaje de error previo (de haberlo)
        this.formErrors[field] = '';
        const control = this.feedbackForm.get(field);

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
