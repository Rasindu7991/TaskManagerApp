import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TaskItem } from '../models/task-item';
import { Observable, tap, map, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  
private API_URL = `${environment.apiUrl}/TaskItems`;
private http = inject(HttpClient);


//Retrieve all Tasks items
getAllTasks(): Observable<TaskItem[]>{
  return this.http.get<TaskItem[]>(this.API_URL, { observe: 'response' }).pipe(
    tap((response: HttpResponse<TaskItem[]>) => {
    }),
    map((response: HttpResponse<TaskItem[]>) => {
      if (response.body === null) {
        return [];
      }
      return response.body;
    }),
    catchError((error: any) => {
      console.error('Error details:', {
        status: error.status,
        statusText: error.statusText,
        message: error.message,
        url: error.url
      });
      if (error.status === 401) {
        console.error('Unauthorized - API Key issue');
      }
      throw error;
    })
  );
}

//Create a new Task item
createTask(task: TaskItem): Observable<TaskItem> {
  return this.http.post<TaskItem>(this.API_URL, task).pipe(
    tap(newTask => console.log('Created task:', newTask)),
    catchError((error: any) => {
      console.error('Error creating task:', error);
      throw error;
    })
  );
}

//Update an existing Task item
updateTask(task: TaskItem): Observable<TaskItem> {
  return this.http.put<TaskItem>(`${this.API_URL}/${task.id}`, task).pipe(
    tap(result => console.log('Update result:', result)),
    catchError((error: any) => {
      console.error('Error updating task:', error);
      throw error;
    })
  );
}

//Delete a Task item
deleteTask(id: number): Observable<void> {
  return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
    tap(() => console.log('Task deleted successfully')),
    catchError((error: any) => {
      console.error('Error deleting task:', error);
      throw error;
    })
  );
}


}