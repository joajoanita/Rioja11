import { Component } from '@angular/core';

import { ActivityService } from '../../service/Activities/activity-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../service/Filtro/search.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  query: string = '';

  constructor(private searchService: SearchService){}


  getImageUrl(imagePath: String): String {
    return `http://127.0.0.1:8000/images/usereImage/${imagePath}`;
  }

  search(){
    this.searchService.updateSearch(this.query);
  }

}
