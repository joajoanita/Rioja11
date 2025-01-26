import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  // Estructura:

  /*
    1. POST: 
    function(data:any): Observable<any>{
        return this.http.post('XXX', data);
    }

    2. GET:
    function(): Observable<any>{
        return this.http.get('XXX');
    }

    3. PUT:
    function(id: any, data:any): Observable<any>{
        return this.http.put(`XXX/${id}`, data);
    }

    4. DELETE:
    function(id:number): Observable<any>{
        return this.http.delete(`XXX/${id}`);
    }
  */

  // 1. Indexamos todas las matriculaciones
  indexStudents(query=''): Observable<any>{
    return this.http.get('http://127.0.0.1:8000/api/admin/index', {params: {buscar:query}});
  }

  // 2. Creamos actividades
  createActivity(data: any): Observable<any>{
    return this.http.post('http://127.0.0.1:8000/api/admin/createActivity', data);
  }

  // 3. Modificamos las actividades
  updateActivity(id:any, data: any): Observable<any>{
    return this.http.put(`http://127.0.0.1:8000/api/admin/updateActivity/${id}`, data);
  }

  // 4. Eliminamos las actividades
  deleteActivity(id: number): Observable<any>{
    return this.http.delete(`http://127.0.0.1:8000/api/admin/deleteActivity/${id}`)
  }

  // 5. Indexamos las categorías
  indexCategories(): Observable<any>{
    return this.http.get('http://127.0.0.1:8000/api/admin/indexCategories');
  }

  // 6. Crear categorías
  createCategory(data: any): Observable<any>{
    return this.http.post('http://127.0.0.1:8000/api/admin/createCategory', data)
  }

  // 7. Modificar categorías
  updateCategory(id: any, data: any): Observable<any>{
    return this.http.put(`http://127.0.0.1:8000/api/admin/updateCategory/${id}`, data)
  }

  // 8. Borramos las categorías
  deleteCategory(id: number): Observable<any>{
    return this.http.delete(`http://127.0.0.1:8000/api/admin/deleteCategory/${id}`)
  }

  // 9. Cambiar el estado de las actividades
  stateActivity(idActivity: number, idStudent: number, state: string): Observable<any>{
    return this.http.put(`http://127.0.0.1:8000/api/admin/index/${idActivity}/${idStudent}`, {estado: state})
  }

  indexMatriculations(): Observable<any>{
    return this.http.get('http://127.0.0.1:8000/api/admin/indexMatriculations');
  }

  deleteStudents(id: number): Observable<any>{
    return this.http.delete(`http://127.0.0.1:8000/api/admin/deleteStudents/${id}`)
  }

  getActivityByCategory(categorias: string[]){
    return this.http.get('http://127.0.0.1:8000/api/admin/index', {params: {categorias: categorias.join(',')}});
  }

  indexActivities(): Observable<any>{
    return this.http.get('http://127.0.0.1:8000/api/admin/indexActivities');
  }
}
