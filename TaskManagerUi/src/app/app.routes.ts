import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./components/login/login').then(m => m.Login)
    },
    {
        path: 'tasks',
        loadComponent: () => import('./components/task-list/task-list').then(m => m.TaskList),
        canActivate: [authGuard]
    },
    {
        path: '',
        redirectTo: '/tasks',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/tasks'
    }
];
