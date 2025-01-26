import { Component } from '@angular/core';
import { AdminService } from '../../../service/Admin/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
  selector: 'app-students',
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent {

  students: any[] = [];
  query: string = '';
  actualPage: number = 1;

  constructor(
    private studentService: AdminService,
  ){}

  ngOnInit(){
    this.indexStudents();
  }

  indexStudents(){
    this.studentService.indexStudents(this.query).subscribe(
      data => {
        this.students = data;
      },
      error => {
        console.error('Error al obtener las matriculaciones', error);
      }
    );
  }

  deleteStudent(id: number){
    this.studentService.deleteStudents(id).subscribe(
      () => {
        this.indexStudents();
        alert('¡Cuidado! Vas a eliminar a un alumno');
        console.log('Alumno eliminado');
      },
      error => {
        console.error('No se ha podido eliminar al alumno', error)
      }
    );
  }
}
