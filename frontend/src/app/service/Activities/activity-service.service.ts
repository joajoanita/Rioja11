import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private http: HttpClient) { }

  // 1. Indexamos las actividades existentes
  indexActivities(query=''): Observable<any>{
    return this.http.get('http://127.0.0.1:8000/api/user/indexActivities', {params: {buscar:query}});
  }

  // 2. Mostrar los detalless de cada actividad 
  activityDetail(id: any): Observable<any>{
    return this.http.get(`http://127.0.0.1:8000/api/user/activityDetail/${id}`);
  }

  // 3. Solicitar matricularse a las actividades
  matriculateActivity(data: any): Observable<any>{
    return this.http.post('http://127.0.0.1:8000/api/user/matriculateActivity', data);
  }

  showActivitiesCategory(categoryName= ''): Observable<any>{
    return this.http.get('http://127.0.0.1:8000/api/user/showActivitiesCategory', {params: {buscar:categoryName}});
  }
}
