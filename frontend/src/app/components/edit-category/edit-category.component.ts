import { Component } from '@angular/core';
import { Category } from '../../models/category';
import { AdminService } from '../../service/Admin/admin.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-category',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent {
  
  category = new Category;
  id: any;
  errorMessage: any = null;
  warningMessage: any = null;
  successMessage: any = null;


  constructor(private categoryService: AdminService, private route: ActivatedRoute, private router: Router){}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (Array.isArray(this.id)) {
      this.id = this.id[0];
    }
  
    console.log('ID:', this.id);
  }
  
  updateCategory(){
    console.log('Datos enviados:', this.category);
    console.log('ID:', this.id);
    this.categoryService.updateCategory(this.id, this.category).subscribe(
      () => {
        this.successMessage = 'Se ha actualizado la información con éxito';
        setTimeout(() => {
          this.router.navigate(['/categories']); 
        }, 3000);
      },
      error => {
        console.error('Error en la solicitud:', error);
        if (error.status === 404){
          this.errorMessage = 'No se ha encontrado la actividad';
        } else {
          this.warningMessage = 'Ha ocurrido algo inesperado, inténtalo más tarde';
        }
      });
  }
} 
