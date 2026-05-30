import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'sh-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-sm">

        <div class="text-center mb-8">
          <div class="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center mx-auto mb-4">⚡</div>
          <h1 class="text-2xl font-bold text-white">Create your account</h1>
          <p class="text-gray-400 text-sm mt-1">Start with 100 free credits</p>
        </div>

        <form (ngSubmit)="submit()" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-400 mb-1.5">Username</label>
            <input [(ngModel)]="form.username" name="username" required minlength="3"
                   class="input" placeholder="john_doe" />
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-1.5">Email</label>
            <input [(ngModel)]="form.email" name="email" type="email" required
                   class="input" placeholder="john@example.com" />
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-1.5">Display Name <span class="text-gray-600">(optional)</span></label>
            <input [(ngModel)]="form.displayName" name="displayName"
                   class="input" placeholder="John Doe" />
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-1.5">Password</label>
            <input [(ngModel)]="form.password" name="password" type="password"
                   required minlength="6" class="input" placeholder="••••••••" />
          </div>

          @if (error()) {
            <div class="rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3">{{ error() }}</div>
          }

          <button type="submit" [disabled]="loading()" class="btn-primary w-full justify-center py-2.5">
            @if (loading()) { Creating account… } @else { Create Account }
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          Already have an account?
          <a routerLink="/login" class="text-brand-400 hover:text-brand-300">Sign in</a>
        </p>

      </div>
    </div>
  `,
})
export class RegisterComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);

  form    = { username: '', email: '', password: '', displayName: '' };
  loading = signal(false);
  error   = signal('');

  submit() {
    this.loading.set(true);
    this.error.set('');
    this.auth.register(this.form).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => {
        this.error.set(err.error?.detail || 'Registration failed.');
        this.loading.set(false);
      },
    });
  }
}
