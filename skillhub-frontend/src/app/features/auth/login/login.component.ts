import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'sh-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-sm">

        <div class="text-center mb-8">
          <div class="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-white">Welcome back</h1>
          <p class="text-gray-400 text-sm mt-1">Sign in to your SkillHub account</p>
        </div>

        <form (ngSubmit)="submit()" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-400 mb-1.5">Username or Email</label>
            <input [(ngModel)]="form.usernameOrEmail" name="usernameOrEmail"
                   required class="input" placeholder="john_doe" />
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-1.5">Password</label>
            <input [(ngModel)]="form.password" name="password" type="password"
                   required class="input" placeholder="••••••••" />
          </div>

          @if (error()) {
            <div class="rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3">
              {{ error() }}
            </div>
          }

          <button type="submit" [disabled]="loading()" class="btn-primary w-full justify-center py-2.5">
            @if (loading()) { Signing in… } @else { Sign In }
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          Don't have an account?
          <a routerLink="/register" class="text-brand-400 hover:text-brand-300">Sign up free</a>
        </p>

      </div>
    </div>
  `,
})
export class LoginComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);

  form    = { usernameOrEmail: '', password: '' };
  loading = signal(false);
  error   = signal('');

  submit() {
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.form).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => {
        this.error.set(err.error?.detail || 'Login failed. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
