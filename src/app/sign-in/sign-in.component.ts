import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/authService/auth-service.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthServiceService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const username = this.loginForm.value.username ?? '';
    const password = this.loginForm.value.password ?? '';
    this.authService
      .login(username, password)
      .subscribe({
        next: (_res) => this.router.navigate(['/dashboard']), 
        error: (err) => alert(JSON.stringify(err))})
  }

}
