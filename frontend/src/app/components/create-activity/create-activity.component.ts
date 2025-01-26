import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../service/Admin/admin.service';
import { Category } from '../../models/category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-activity',
  imports: [FormsModule, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './create-activity.component.html',
  styleUrl: './create-activity.component.css'
})
export class CreateActivityComponent {

  activityForm: FormGroup;
  selectedFile: File | undefined ;
  categories: { id: number; nombre: string }[] = [];
  selectedCategory: string | null = null; 
  errorMessage: any = null; 
  successMessage: any = null;
  warningMessage: any = null;

  
  constructor(
    private activityService: AdminService, 
    private router: Router,
    private fb: FormBuilder
  ){
      this.activityForm = this.fb.group({
        titulo: [''],
        descripcion: [''],
        horario: [''],
        cuota: [''],
        etapaEducativa: [''],
        categorias: [''],
        imagenActividad: [],
      });
  }

  ngOnInit(){
    this.categoriesName();
  }

  onSubmit(){
    if(this.activityForm.valid && this.selectedFile){
      const formData = new FormData();
      formData.append('titulo', this.activityForm.get('titulo')!.value);
      formData.append('descripcion', this.activityForm.get('descripcion')!.value);
      formData.append('horario', this.activityForm.get('horario')!.value);
      formData.append('cuota', this.activityForm.get('cuota')!.value);
      formData.append('etapaEducativa', this.activityForm.get('etapaEducativa')!.value);
      formData.append('imagenActividad', this.selectedFile, this.selectedFile.name);

      const categorias = this.activityForm.get('categorias')!.value;
      if (Array.isArray(categorias)) {
        categorias.forEach((categoria: any) => {
            formData.append('categorias[]', categoria);
        });
      } else {
          formData.append('categorias[]', categorias);
      }

      this.activityService.createActivity(formData).subscribe(
        response => {
          console.log('Actividad creada', response);
          this.successMessage = 'Actividad creada con éxito.'
          this.activityForm.reset();
          setTimeout(() => {
            this.router.navigate(['/activities']); 
          }, 3000);
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
      console.error('Formulario no válido o archivo no seleccionado');
    }
  }


  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0]; // Guarda el archivo seleccionado
    } else {
      console.error('No se seleccionó ningún archivo o files es undefined');
    }
  }

  categoriesName(){
    this.activityService.indexCategories().subscribe(
      data => {
        this.categories = data;
      },
      error => {
        console.error('No se han podido obtener las categorías', error);
      }
    );
  }
}
