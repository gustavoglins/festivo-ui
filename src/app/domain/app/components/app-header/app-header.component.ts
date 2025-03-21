import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { TabsModule } from 'primeng/tabs';
import { AuthService } from '../../../auth/services/auth.service';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-app-header',
  imports: [
    RouterModule,
    ButtonModule,
    PopoverModule,
    TabsModule,
    CommonModule,
    FormsModule,
    DividerModule
  ],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent implements OnInit {
  isAuthenticated = signal(false);
  notifications = signal<any[]>([]);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated.set(this.authService.isAuthenticated());
  }

  onLogout(): void {
    this.authService.logout();
  }
}
