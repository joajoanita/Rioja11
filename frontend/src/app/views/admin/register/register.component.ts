import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../service/Auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule,RouterModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: any = null;
  warningMessage: any = null;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public authService: AuthService,
  ) {
    this.registerForm = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      password_confirmation: [''],
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = new FormData();
      formData.append('name', this.registerForm.get('name')!.value);
      formData.append('email', this.registerForm.get('email')!.value);
      formData.append('password', this.registerForm.get('password')!.value);

      this.authService.register(formData).subscribe(
        response => {
          console.log('User added successfully!', response);
          this.registerForm.reset();
          this.router.navigate(['login']);
        },
        error => {
          if(error.status === 400){
            this.errorMessage = 'La contraseña debe de tener 8 carácteres, mayúsculas, minúsculas y carácteres especiales.';
            console.error('Error adding the user', error);
          } else {
            this.warningMessage = 'Ha ocurrido algo inesperado, inténtalo más tarde.'
            console.error('Error adding the user', error);
          }
        }
      );
    } else {
      console.error('Formulario no válido o archivo no seleccionado');
    }
  }

}
