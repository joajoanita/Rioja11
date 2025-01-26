import { Component } from '@angular/core';
import { AdminService } from '../../../service/Admin/admin.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-matriculations',
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './matriculations.component.html',
  styleUrl: './matriculations.component.css'
})
export class MatriculationsComponent {

  matriculations: any[] = [];
  actualPage: number = 1;

  constructor(private matriculationService: AdminService){}

  ngOnInit(){
    this.indexMatriculations();
  }

  indexMatriculations(){
    this.matriculationService.indexMatriculations().subscribe(
      data => {
        console.log(data.flat());
        this.matriculations = data.flat().reverse();

      }, 
      error => {
        console.error('Error al obtener las matriculaciones', error);
      }
    );
  }

  changeState(activityId: number, studentId: number, state: string): void {
    this.matriculationService.stateActivity(activityId, studentId, state).subscribe(response => {
      console.log('Estado actualizado:', response); 
      this.indexMatriculations();

    }, error => {
      console.error('Error al cambiar estado:', error);
      this.indexMatriculations();

      if (error.status === 400) {
        alert('No se pueden añadir más usuarios.');
      }
      
    });
  }
}
