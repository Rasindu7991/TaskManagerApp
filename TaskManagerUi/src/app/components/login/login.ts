import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})

export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  loginForm!: FormGroup;
  errorMessage = signal<string | null>(null);

  constructor() {
    this.loginForm = this.fb.group({
      'username': ['', [Validators.required, Validators.minLength(3)]], 
      'password': ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  // Helper for displaying validation errors
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.errorMessage.set(null); // Clear previous errors

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      
      if (this.authService.login(username, password)) {
        // After successful login navigate to the tasks dashboard
        this.router.navigate(['/tasks']);
      } else {
        this.errorMessage.set('Invalid username or password');
      }
    } else {
      this.errorMessage.set('Please fill out the form correctly.');
    }
  }
}