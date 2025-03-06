import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () => import('./core/layout/auth/auth.layout').then(m => m.AuthLayout),
        children: [
            {
                path: 'signup',
                loadComponent: () => import('./domain/auth/pages/signup/signup.page').then(m => m.SignupPage)
            },
            {
                path: 'login',
                loadComponent: () => import('./domain/auth/pages/login/login.page').then(m => m.LoginPage)
            }
        ]
    }
];
