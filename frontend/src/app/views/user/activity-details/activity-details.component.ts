import { Component } from '@angular/core';
import { ActivityService } from '../../../service/Activities/activity-service.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';

@Component({
  selector: 'app-activity-details',
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './activity-details.component.html',
  styleUrl: './activity-details.component.css'
})
export class ActivityDetailsComponent {
  activity: any;
  id: any;
  categories: any[] = [];
  matriculateForm: FormGroup;
  errorMessage: any = null;
  successMessage: any = null;

  constructor(private activityService : ActivityService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router){
    this.matriculateForm = this.fb.group({
      nombre: [],
      apellidos: [],
      nombreAdultoResponsable: [],
      apellidoAdultoResponsable: [],
      telefonoAdultoResponsable: [],
      emailAdultoResponsable: [],
      actividades: [], 
    });
  }

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.id = +params['id']; // Obtiene el ID del parámetro de la ruta
      this.activityDetail(this.id); // Carga los detalles de la actividad
    });
  }

  activityDetail(id: any){
    this.activityService.activityDetail(this.id).subscribe(
        data => {
          this.activity = data;
          this.categories = data.categorias;
          this.matriculateForm.patchValue({
            actividades: [this.id]  
          });
          console.log(data.categorias);
        },
        error => {
          console.error('Error al cargar los detalles de la actividad', error);
        }
    );
  }

  getImageUrl(imagePath: string): string {
    return `http://127.0.0.1:8000/images/activities/${imagePath}`;
  }

  matriculateActivity(event: Event) {
    if (this.matriculateForm.valid) {
      const formData = new FormData();
      formData.append('nombre', this.matriculateForm.get('nombre')!.value);
      formData.append('apellidos', this.matriculateForm.get('apellidos')!.value);
      formData.append('nombreAdultoResponsable', this.matriculateForm.get('nombreAdultoResponsable')!.value);
      formData.append('apellidoAdultoResponsable', this.matriculateForm.get('apellidoAdultoResponsable')!.value);
      formData.append('telefonoAdultoResponsable', this.matriculateForm.get('telefonoAdultoResponsable')!.value);
      formData.append('emailAdultoResponsable', this.matriculateForm.get('emailAdultoResponsable')!.value);

      const actividadId = this.matriculateForm.get('actividades')?.value;
      if (actividadId) {
        formData.append('actividades', actividadId);  
      } else {
        console.error('No se seleccionó una actividad');
        return;
      }
  
      this.activityService.matriculateActivity(formData).subscribe(
        response => {
          console.log('Alumno inscrito con éxito', response);
          this.successMessage = 'Alumno inscrito con éxito';
          this.matriculateForm.reset();
          setTimeout(() => {
            this.router.navigate(['/home']); 
          }, 3000);
        },
        error => {
          if (error.status === 400) {
            this.errorMessage = 'El teléfono tiene que tener entre 9 y 15 números o el campo del email está vacío.';
          } else {
            this.errorMessage = 'Ha ocurrido algo inesperado, inténtalo más tarde.'
            console.error('No se ha podido inscribir al alumno', error);
          }
        }
      );
    } else {
      console.error('El formulario no es válido');
    }
  }
}