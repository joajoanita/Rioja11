import { Component } from '@angular/core';
import { ActivityService} from '../../../service/Activities/activity-service.service';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SearchService } from '../../../service/Filtro/search.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { AdminService } from '../../../service/Admin/admin.service';

@Component({
  selector: 'app-home',
  imports: [RouterModule, RouterLink, CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  activities: any[] = [];
  searchQuery: string = '';
  searchSubscription: Subscription | undefined;
  actualPage: number = 1;
  warningMessage: any = null;
  categories: any[] = [];
  category: any;
  query: string = '';
  actividades: any[] = [];

  changeColor: string | null = null;

  constructor(private activityService : ActivityService , private searchService: SearchService, private categoryService: AdminService){}

  ngOnInit(): void{
    this.searchSubscription = this.searchService.currentSearch$.subscribe(
      query => {
          this.searchQuery = query;
          this.indexActivities();
    });

    this.indexActivities();
    this.indexCategories();

    
 
  }

  ngOnDestroy(){
    if(this.searchSubscription){
      this.searchSubscription.unsubscribe();
    }
  }

  indexActivities(){
    this.activityService.indexActivities(this.searchQuery).subscribe(
      data => {
        this.activities = data;
        
      }, 
      error => {
        if(error.status === 429){
            this.warningMessage = "Ha sucedido algo inesperado cargando las actividades, intentalo más tarde."
        } 
      }
    );
  }

  filterByCategory(categoryName: string){
    this.activityService.showActivitiesCategory(categoryName).subscribe(
      data => {
        this.activities = data.activities;
        this.changeColor = categoryName;
      },
      error => {
        console.error('Error al filtrar actividades', error);
      }
    );
  }
  
  indexCategories() {
    this.categoryService.indexCategories().subscribe(
      data => {
        this.categories = data;
        console.log(this.categories);
      },   
      error => {
        if (error.status === 429) {
          this.warningMessage = "Ha sucedido algo inesperado cargando las actividades, inténtalo más tarde."
        }
      }
    );
  }

  



  getImageUrl(imagePath: string): string{
    return `http://127.0.0.1:8000/images/activities/${imagePath}`;
  }
}
