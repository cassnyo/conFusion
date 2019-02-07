import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  @ViewChild('fform') feedbackFormDirective;

  constructor(private formBuilder: FormBuilder) {
    this.createForm();
   }

  ngOnInit() {
  }

  createForm() {
    // Defiminimos el modelo de formulario de feedback
    this.feedbackForm =  this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      telnum: [0, Validators.required],
      email: ['', Validators.required],
      agree: false,
      contacttype: 'None',
      message: ''
    });
  }

  onSubmit() {
    // Copiamos el valor del modelo de formulario (FormGroup) a un modelo de datos (Feedback)
    // Esto podemos hacerlo porque ambos modelos son idénticos (mismos atributos), si fuesen diferentes
    // tendríamos que mapear cada atributo a mano
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
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

}
