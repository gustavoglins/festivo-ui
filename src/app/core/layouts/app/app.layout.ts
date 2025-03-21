import { Component, signal } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { AppHeaderComponent } from '../../../domain/app/components/app-header/app-header.component';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-app',
  imports: [RouterModule, AppHeaderComponent],
  templateUrl: './app.layout.html',
  styleUrl: './app.layout.scss',
})
export class AppLayout {
  pageTitle = signal<any>('');
  pageDescription = signal<any>('');

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute.firstChild;
          while (route?.firstChild) route = route.firstChild;
          return {
            title: route?.snapshot.data['title'] || 'Error: No Title!',
            description:
              route?.snapshot.data['description'] || 'Error: No Description!',
          };
        })
      )
      .subscribe(({ title, description }) => {
        this.pageTitle.set(title);
        this.pageDescription.set(description);
      });
  }
}
