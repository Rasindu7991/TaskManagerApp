import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TaskItem } from '../models/task-item';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  
private API_URL = 'https://localhost:7127/api/TaskItems';
private http = inject(HttpClient);


//Retrieve all Tasks items
getAllTasks(): Observable<TaskItem[]>{
  return this.http.get<TaskItem[]>(this.API_URL);
}

//Create a new Task item
createTask(task: TaskItem) : Observable<TaskItem>{
  return this.http.post<TaskItem>(this.API_URL,task);
}

//Update an existing Task item
updateTask(task: TaskItem) : Observable<any>{
  return this.http.put(`${this.API_URL}/${task.id}`,task);
}


//Delete a Task item
deleteTask(id: number) : Observable<any>{
 return this.http.delete(`${this.API_URL}/${id}`);
}


}