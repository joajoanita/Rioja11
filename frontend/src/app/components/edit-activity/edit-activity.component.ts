import { Component } from '@angular/core';
import { AdminService } from '../../service/Admin/admin.service';
import { Activity } from '../../models/activity';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-edit-activity',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-activity.component.html',
  styleUrl: './edit-activity.component.css'
})
export class EditActivityComponent {

  activity = new Activity;
  id: any;
  errorMessage: any = null;
  warningMessage: any = null;
  successMessage: any = null;
  selectedFile: File | undefined;

  constructor(private activityService: AdminService, private router: Router, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
  }
  


  updateActivity(){
    this.activityService.updateActivity(this.id, this.activity).subscribe(
      () => {
        this.successMessage = 'Se ha actualizado la información con éxito';
        setTimeout(() => {
          this.router.navigate(['/activities']); 
        }, 3000);
      },
      error => {
        if (error.status === 404){
          this.errorMessage = 'No se ha encontrado la actividad';
        } else {
          this.warningMessage = 'Ha ocurrido algo inesperado, inténtalo más tarde';
        }
      });
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0]; // Guarda el archivo seleccionado
    } else {
      console.error('No se seleccionó ningún archivo o files es undefined');
    }
  }
}
