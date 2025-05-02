import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthAdsComponent } from "./auth-ads/auth-ads.component";

@Component({
  selector: 'app-auth',
  imports: [RouterModule, AuthAdsComponent],
  templateUrl: './auth.layout.html',
  styleUrl: './auth.layout.scss'
})
export class AuthLayout {

}
