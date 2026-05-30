import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'sh-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 border-b border-gray-800 bg-surface-900/90 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-14 items-center justify-between gap-4">

          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 shrink-0">
            <div class="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zm9.3 1.564l-4 1.714a1 1 0 01-.787 0l-4-1.714v-.043l4 1.714 4-1.714v.043z"/>
              </svg>
            </div>
            <span class="font-bold text-white text-lg tracking-tight">SkillHub</span>
          </a>

          <!-- Nav links -->
          <nav class="hidden md:flex items-center gap-1">
            <a routerLink="/marketplace" routerLinkActive="text-white bg-white/5"
               class="px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              Marketplace
            </a>
            <a routerLink="/playground" routerLinkActive="text-white bg-white/5"
               class="px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              Playground
            </a>
          </nav>

          <!-- Right -->
          <div class="flex items-center gap-2">
            @if (auth.isLoggedIn()) {
              <a routerLink="/publish" class="btn-secondary text-xs py-1.5">
                + Publish Skill
              </a>
              <a routerLink="/account"
                 class="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-medium">
                {{ auth.currentUser()?.username?.charAt(0)?.toUpperCase() }}
              </a>
            } @else {
              <a routerLink="/login" class="btn-secondary text-xs py-1.5">Login</a>
              <a routerLink="/register" class="btn-primary text-xs py-1.5">Sign up free</a>
            }
          </div>

        </div>
      </div>
    </header>
  `,
})
export class NavbarComponent {
  auth = inject(AuthService);
}
