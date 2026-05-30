import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { SkillService } from '../../core/services/skill.service';
import { SkillCardComponent } from '../../shared/components/skill-card/skill-card.component';
import { SkillSummary } from '../../core/models/skill.model';

@Component({
  selector: 'sh-account',
  standalone: true,
  imports: [RouterLink, DecimalPipe, DatePipe, SkillCardComponent],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-10">

      <!-- Profile header -->
      <div class="card p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div class="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center text-2xl font-bold text-white shrink-0">
          {{ user()?.username?.charAt(0)?.toUpperCase() }}
        </div>
        <div class="flex-1">
          <h1 class="text-xl font-bold text-white">{{ user()?.displayName || user()?.username }}</h1>
          <p class="text-gray-400 text-sm">{{ user()?.email }}</p>
          <div class="flex items-center gap-4 mt-2">
            <span class="badge bg-brand-500/10 text-brand-400 border border-brand-500/20">
              {{ user()?.credits }} Credits
            </span>
            <span class="badge bg-surface-700 text-gray-300">{{ user()?.role }}</span>
          </div>
        </div>
        <a routerLink="/publish" class="btn-primary text-sm shrink-0">+ Publish Skill</a>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 border-b border-gray-800 mb-6">
        @for (tab of tabs; track tab.key) {
          <button (click)="activeTab.set(tab.key)"
                  [class.text-white]="activeTab() === tab.key"
                  [class.border-b-2]="activeTab() === tab.key"
                  [class.border-brand-500]="activeTab() === tab.key"
                  class="px-4 pb-3 text-sm text-gray-400 hover:text-white transition-colors -mb-px">
            {{ tab.label }}
          </button>
        }
      </div>

      <!-- My Skills -->
      @if (activeTab() === 'skills') {
        @if (mySkills().length === 0) {
          <div class="text-center py-16 text-gray-500">
            <p class="text-3xl mb-3">📭</p>
            <p>You haven't published any skills yet.</p>
            <a routerLink="/publish" class="btn-primary mt-4 inline-flex">Publish your first skill</a>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (skill of mySkills(); track skill.id) {
              <sh-skill-card [skill]="skill" />
            }
          </div>
        }
      }

      <!-- Favorites -->
      @if (activeTab() === 'favorites') {
        @if (favorites().length === 0) {
          <div class="text-center py-16 text-gray-500">
            <p class="text-3xl mb-3">♡</p>
            <p>No favorites yet. Browse the <a routerLink="/marketplace" class="text-brand-400">marketplace</a>!</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (skill of favorites(); track skill.id) {
              <sh-skill-card [skill]="skill" />
            }
          </div>
        }
      }

      <!-- Logout -->
      @if (activeTab() === 'settings') {
        <div class="card p-6 max-w-md">
          <h2 class="text-white font-semibold mb-4">Account Settings</h2>
          <div class="space-y-3 text-sm text-gray-400 mb-6">
            <div class="flex justify-between"><span>Member since</span><span class="text-gray-200">{{ user()?.createdAt | date:'mediumDate' }}</span></div>
            <div class="flex justify-between"><span>Credits</span><span class="text-brand-400 font-medium">{{ user()?.credits }}</span></div>
          </div>
          <button (click)="logout()" class="btn-secondary text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50">
            Sign out
          </button>
        </div>
      }
    </div>
  `,
})
export class AccountComponent implements OnInit {
  private authService  = inject(AuthService);
  private skillService = inject(SkillService);

  user      = this.authService.currentUser;
  activeTab = signal('skills');
  mySkills  = signal<SkillSummary[]>([]);
  favorites = signal<SkillSummary[]>([]);

  tabs = [
    { key: 'skills',    label: 'My Skills'   },
    { key: 'favorites', label: 'Favorites'   },
    { key: 'settings',  label: 'Settings'    },
  ];

  ngOnInit() {
    this.skillService.mySkills().subscribe(p => this.mySkills.set(p.content));
    this.skillService.favorites().subscribe(p => this.favorites.set(p.content));
  }

  logout() { this.authService.logout(); }
}
