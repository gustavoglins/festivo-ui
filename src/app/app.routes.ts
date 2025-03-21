import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/layouts/app/app.layout').then((m) => m.AppLayout),
    children: [
      {
        title: 'Home - Festivo',
        path: 'home',
        loadComponent: () =>
          import('./domain/app/pages/home/home.page').then((m) => m.HomePage),
        data: {
          title: 'Home',
          description: 'Overview of upcoming parties and events.',
        },
      },
      {
        title: 'Events - Festivo',
        path: 'parties',
        loadComponent: () =>
          import('./domain/app/pages/parties/parties.page').then(
            (m) => m.PartiesPage
          ),
        data: {
          title: 'Events',
          description: 'Browse events near you.',
        },
      },
      {
        title: 'Create Event - Festivo',
        path: 'create-party',
        loadComponent: () =>
          import('./domain/app/pages/create-party/create-party.page').then(
            (m) => m.CreatePartyPage
          ),
        canActivate: [authGuard],
        data: {
          title: 'Create Event',
          description: 'Plan and set up a new event.',
        },
      },
      {
        title: 'My Events - Festivo',
        path: 'my-parties',
        loadComponent: () =>
          import('./domain/app/pages/my-parties/my-parties.page').then(
            (m) => m.MyPartiesPage
          ),
        canActivate: [authGuard],
        data: {
          title: 'My Events',
          description: 'Manage your hosted and joined events.',
        },
      },
      {
        title: 'Friends Invitations - Festivo',
        path: 'friends-invitations',
        loadComponent: () =>
          import(
            './domain/app/pages/friends-invitations/friends-invitations.page'
          ).then((m) => m.FriendsInvitationsPage),
        canActivate: [authGuard],
        data: {
          title: 'Friends Invitations',
          description: 'Manage your party invitations.',
        },
      },
      {
        title: 'Profile - Festivo',
        path: 'profile',
        loadComponent: () =>
          import('./domain/app/pages/profile/profile.page').then(
            (m) => m.ProfilePage
          ),
        canActivate: [authGuard],
        data: {
          title: 'Profile',
          description: 'Manage your profile and account settings.',
        },
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./core/layouts/auth/auth.layout').then((m) => m.AuthLayout),
    children: [
      {
        title: 'Sign Up - Festivo',
        path: 'signup',
        loadComponent: () =>
          import('./domain/auth/pages/signup/signup.page').then(
            (m) => m.SignupPage
          ),
      },
      {
        title: 'Login - Festivo',
        path: 'login',
        loadComponent: () =>
          import('./domain/auth/pages/login/login.page').then(
            (m) => m.LoginPage
          ),
      },
      {
        title: 'Recover Password - Festivo',
        path: 'password',
        loadComponent: () =>
          import('./domain/auth/pages/password/password.page').then(
            (m) => m.PasswordPage
          ),
      },
    ],
  },
];
