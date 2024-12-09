import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, NgIf],
  templateUrl: './contact-form.component.html',
})
export class ContactFormComponent {
  private readonly path = "/api/contact";

  private formBuilder = inject(FormBuilder);
  private http = inject(HttpClient);

  public contactForm: FormGroup;
  public successMessage: boolean = false;

  constructor() {
    this.contactForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.maxLength(300)]],
    });
  }

  public async onSubmit(): Promise<void> {
    if (this.contactForm.valid) {
      const payload = this.contactForm.value;
      try {
        await firstValueFrom(this.http.post<void>(this.path, payload));
        this.successMessage = true;
        this.contactForm.reset();
      } catch(err) {
        //Simulate success
        this.successMessage = true;
        this.contactForm.reset();
        console.error('ContactForm.onSubmit: ', err);
      }
    }
  }
}
