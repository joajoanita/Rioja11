import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/Auth/auth.service';
import { TokenService } from '../../../service/Auth/token.service';
import { Router, RouterModule } from '@angular/router';
import { AuthStateService } from '../../../service/Auth/auth-state.service';
import { User } from '../../../models/user';
import { ActivityService } from '../../../service/Activities/activity-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{
  user = new User;
  selectedFile: File | null = null;
  activities: any[] = [];

  constructor(public authService: AuthService, 
    private router: Router, 
    private token: TokenService, 
    private authState: AuthStateService,
    private activityService: ActivityService){
  }

  ngOnInit(): void {
    this.authService.profileUser().subscribe(
      (data) => {
        console.log('Perfil del usuario:', data);
        this.user = data;
      },
      (error) => {
        console.error('Error al obtener el perfil del usuario', error);
        if (error.status === 401) {
          console.log('Token inválido o no proporcionado.');
        }
      }
    );

    this.indexActivities();
  }

  
  getImageUrl(imagePath: String): String {
    return `http://127.0.0.1:8000/images/userImage/${imagePath}`;
  }
  
  signOut() {
    this.authState.setAuthState(false);
    this.token.removeToken();
    this.router.navigate(['home']);
  }
  
  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0]; // Guarda el archivo seleccionado
    } else {
      console.error('No se seleccionó ningún archivo o files es undefined');
    }
  }

  indexActivities(){
    this.activityService.indexActivities().subscribe(
      data => {
        this.activities = data.reverse();
      }, 
      error => {
        console.error('Error al obtener las actividades', error);
      }
    );
  }
}

