import { Routes } from '@angular/router';
import { HomeComponent } from './views/user/home/home.component';
import { DashboardComponent } from './views/admin/dashboard/dashboard.component';
import { adminGuard } from './guards/admin.guard';
import { LoginComponent } from './views/admin/login/login.component';
import { RegisterComponent } from './views/admin/register/register.component';
import { ActivityDetailsComponent } from './views/user/activity-details/activity-details.component';
import { ContactComponent } from './views/user/contact/contact.component';
import { UserProfileComponent } from './views/admin/user-profile/user-profile.component';
import { ActivitiesComponent } from './views/admin/activities/activities.component';
import { CategoriesComponent } from './views/admin/categories/categories.component';
import { StudentsComponent } from './views/admin/students/students.component';
import { MatriculationsComponent } from './views/admin/matriculations/matriculations.component';
import { CreateActivityComponent } from './components/create-activity/create-activity.component';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
import { EditActivityComponent } from './components/edit-activity/edit-activity.component';
import { EditCategoryComponent } from './components/edit-category/edit-category.component';


export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent},
    { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard]},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'activityDetail/:id', component: ActivityDetailsComponent},
    { path: 'contact', component: ContactComponent},
    { path: 'profile', component: UserProfileComponent, canActivate: [adminGuard]},
    { path: 'activities', component: ActivitiesComponent, canActivate: [adminGuard]},
    { path: 'categories', component: CategoriesComponent, canActivate: [adminGuard]},
    { path: 'students', component: StudentsComponent, canActivate: [adminGuard]},
    { path: 'matriculations', component: MatriculationsComponent, canActivate: [adminGuard]},
    { path: 'createActivity', component: CreateActivityComponent, canActivate: [adminGuard]},
    { path: 'createCategory', component: CreateCategoryComponent, canActivate: [adminGuard]},
    { path: 'editActivity/:id', component: EditActivityComponent},
    { path: 'editCategory/:id', component: EditCategoryComponent},
];
