import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../service/Admin/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-category',
  imports: [FormsModule, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css'
})
export class CreateCategoryComponent {

  categoryForm: FormGroup;
  errorMessage: any = null; 
  successMessage: any = null;
  warningMessage: any = null;

  constructor(
    private categoryService: AdminService,
    private router: Router,
    private fb: FormBuilder,
  ){
    this.categoryForm = this.fb.group({
        nombre: [''],
        descripcion: [''],
    });
  }

  onSubmit(){
    if(this.categoryForm.valid){
      const formData = new FormData;

      formData.append('nombre', this.categoryForm.get('nombre')!.value);
      formData.append('descripcion', this.categoryForm.get('descripcion')!.value);

      this.categoryService.createCategory(formData).subscribe(
        response => {
          console.log('Categoria creada', response);
          this.categoryForm.reset();
          this.router.navigate(['categories'])
        }, 
        error => {
          if(error.status === 400){
            this.errorMessage = 'Datos incorrectos';
          } else if(error.status === 503) {
            this.errorMessage = 'No has seleccionado ninguna categoría.'
          } else if(error.status === 429){
            this.warningMessage = 'Ha ocurrido un error, intentalo más tarde.'
          }else {
            this.errorMessage = 'No se ha podido añadir la actividad.'
          }
          console.error('Error al añadir una actividad', error);
        }
      );
    } else {
      console.error('Formulario no válido')
    }
  }
}
