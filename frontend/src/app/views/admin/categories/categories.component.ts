import { Component } from '@angular/core';
import { AdminService } from '../../../service/Admin/admin.service';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  imports: [RouterModule, NgxPaginationModule, CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  categories: any[] = [];
  actualPage: number = 1;

  
  constructor(private service: AdminService){}

  ngOnInit(){

    this.indexCategories();
  }

  indexCategories(){
    this.service.indexCategories().subscribe(
      data => {
        this.categories = data;
      },
      error => {
        console.error('Error al obtener las categorías', error);
      }
    );
  }

  deleteCategory(id: number){
    this.service.deleteCategory(id).subscribe(
      () => {
        this.indexCategories();
        alert('Vas a eliminar una categoría');
        console.log(`Se ha eliminado la categoría con id ${id}`);
      },
      error => {
        console.error('No se ha podido eliminar la categoría', error);
      }
    );
  }


}
