import { Component, OnInit, inject, signal, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { SkillService } from '../../core/services/skill.service';
import { AuthService } from '../../core/services/auth.service';
import { SkillDetail } from '../../core/models/skill.model';

@Component({
  selector: 'sh-skill-detail',
  standalone: true,
  imports: [RouterLink, DecimalPipe, DatePipe],
  template: `
    @if (loading()) {
      <div class="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">Loading…</div>
    } @else if (skill()) {
      <div class="max-w-4xl mx-auto px-4 py-10">

        <!-- Breadcrumb -->
        <nav class="text-sm text-gray-500 mb-6">
          <a routerLink="/marketplace" class="hover:text-white">Marketplace</a>
          <span class="mx-2">/</span>
          @if (skill()!.categoryName) {
            <span>{{ skill()!.categoryName }}</span>
            <span class="mx-2">/</span>
          }
          <span class="text-gray-300">{{ skill()!.name }}</span>
        </nav>

        <div class="grid md:grid-cols-3 gap-8">

          <!-- Main content -->
          <div class="md:col-span-2">
            <div class="flex items-start gap-4 mb-6">
              <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-500/30 to-surface-700 flex items-center justify-center text-3xl shrink-0">
                {{ skill()!.thumbnailUrl ? '' : '⚡' }}
              </div>
              <div>
                <h1 class="text-2xl font-bold text-white">{{ skill()!.name }}</h1>
                <div class="flex items-center gap-3 mt-1 text-sm text-gray-400">
                  <span>by <strong class="text-gray-200">{{ skill()!.authorDisplayName || skill()!.authorUsername }}</strong></span>
                  <span>v{{ skill()!.version }}</span>
                  @if (skill()!.aiScore) {
                    <span class="text-brand-400">★ {{ skill()!.aiScore | number:'1.1-1' }}</span>
                  }
                </div>
              </div>
            </div>

            <p class="text-gray-300 leading-relaxed mb-6">{{ skill()!.description }}</p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-6">
              @for (tag of skill()!.tags; track tag) {
                <span class="badge bg-surface-700 border border-gray-700 text-gray-300">{{ tag }}</span>
              }
            </div>

            <!-- Skill content (SKILL.md) -->
            <div class="card p-6">
              <h2 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Skill Content</h2>
              <pre class="text-gray-300 text-sm font-mono whitespace-pre-wrap overflow-auto max-h-96">{{ skill()!.content }}</pre>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-4">

            <!-- Install card -->
            <div class="card p-5">
              <div class="text-center mb-4">
                <div class="text-3xl font-bold text-white">{{ skill()!.installCount | number }}</div>
                <div class="text-gray-400 text-sm">total installs</div>
              </div>
              <button (click)="install()" class="btn-primary w-full justify-center mb-2">
                ⬇ Install Skill
              </button>
              <button (click)="openPlayground()" class="btn-secondary w-full justify-center text-xs">
                ▶ Try in Playground
              </button>
              @if (installed()) {
                <p class="text-center text-green-400 text-xs mt-2">✓ Installed!</p>
              }
            </div>

            <!-- Favorite -->
            @if (auth.isLoggedIn()) {
              <button (click)="toggleFavorite()"
                      class="btn-secondary w-full justify-center">
                {{ favorited() ? '♥ Unfavorite' : '♡ Add to Favorites' }}
              </button>
            }

            <!-- Meta -->
            <div class="card p-5 space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Category</span>
                <span class="text-gray-200">{{ skill()!.categoryName || '—' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Version</span>
                <span class="text-gray-200 font-mono">{{ skill()!.version }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Updated</span>
                <span class="text-gray-200">{{ skill()!.updatedAt | date:'mediumDate' }}</span>
              </div>
            </div>

            <!-- Compatible agents -->
            @if (skill()!.compatibleAgents.length) {
              <div class="card p-5">
                <h3 class="text-white text-sm font-semibold mb-3">Compatible Agents</h3>
                <div class="flex flex-wrap gap-1.5">
                  @for (agent of skill()!.compatibleAgents; track agent) {
                    <span class="badge bg-green-500/10 text-green-400 border border-green-500/20">{{ agent }}</span>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class SkillDetailComponent implements OnInit {
  @Input() slug!: string;

  private skillService = inject(SkillService);
  auth = inject(AuthService);

  skill     = signal<SkillDetail | null>(null);
  loading   = signal(true);
  installed = signal(false);
  favorited = signal(false);

  ngOnInit() {
    this.skillService.detail(this.slug).subscribe({
      next: s  => { this.skill.set(s); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  install() {
    this.skillService.install(this.skill()!.id).subscribe(() => this.installed.set(true));
  }

  toggleFavorite() {
    this.skillService.toggleFavorite(this.skill()!.id).subscribe(
      r => this.favorited.set(r.favorited));
  }

  openPlayground() {
    window.location.href = `/playground/${this.slug}`;
  }
}
