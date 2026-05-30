import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkillService } from '../../core/services/skill.service';
import { CollectionService } from '../../core/services/collection.service';
import { SkillCardComponent } from '../../shared/components/skill-card/skill-card.component';
import { SkillSummary } from '../../core/models/skill.model';
import { Collection, Category } from '../../core/models/collection.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'sh-home',
  standalone: true,
  imports: [RouterLink, SkillCardComponent, DecimalPipe],
  template: `
    <!-- Hero -->
    <section class="relative overflow-hidden py-20 px-4">
      <div class="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-transparent pointer-events-none"></div>
      <div class="max-w-4xl mx-auto text-center relative">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"></span>
          10,000+ AI-evaluated skills
        </div>
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          The Skills Marketplace<br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-300">
            for AI Agents
          </span>
        </h1>
        <p class="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Discover, install and share skills for Claude Code, Cursor, Copilot, Windsurf and 9+ AI coding tools.
          One click to deploy everywhere.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a routerLink="/marketplace" class="btn-primary px-6 py-3 text-base">
            Browse Skills
          </a>
          <a routerLink="/playground" class="btn-secondary px-6 py-3 text-base">
            Try in Playground
          </a>
        </div>
      </div>
    </section>

    <!-- Stats bar -->
    <section class="border-y border-gray-800 bg-surface-800/50 py-6">
      <div class="max-w-7xl mx-auto px-4 grid grid-cols-3 divide-x divide-gray-800 text-center">
        <div class="px-4">
          <div class="text-2xl font-bold text-white">10,000+</div>
          <div class="text-gray-400 text-sm mt-1">Skills</div>
        </div>
        <div class="px-4">
          <div class="text-2xl font-bold text-white">9+</div>
          <div class="text-gray-400 text-sm mt-1">Supported Agents</div>
        </div>
        <div class="px-4">
          <div class="text-2xl font-bold text-white">1-click</div>
          <div class="text-gray-400 text-sm mt-1">Install</div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    @if (categories().length) {
      <section class="max-w-7xl mx-auto px-4 py-12">
        <h2 class="text-lg font-semibold text-white mb-6">Browse by Category</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          @for (cat of categories(); track cat.id) {
            <a [routerLink]="['/marketplace']" [queryParams]="{category: cat.id}"
               class="card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors group">
              <div class="text-2xl mb-2">{{ catIcon(cat.icon) }}</div>
              <div class="text-white text-sm font-medium group-hover:text-brand-400 transition-colors">
                {{ cat.name }}
              </div>
              <div class="text-gray-500 text-xs mt-0.5">{{ cat.description }}</div>
            </a>
          }
        </div>
      </section>
    }

    <!-- Trending Skills -->
    <section class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-white">🔥 Trending</h2>
        <a routerLink="/marketplace" [queryParams]="{sort: 'trending'}"
           class="text-brand-400 text-sm hover:text-brand-300">View all →</a>
      </div>
      @if (loading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (i of [1,2,3,4]; track i) {
            <div class="card h-56 animate-pulse bg-surface-700"></div>
          }
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (skill of trending(); track skill.id) {
            <sh-skill-card [skill]="skill" (install)="onInstall($event)" />
          }
        </div>
      }
    </section>

    <!-- Latest Skills -->
    <section class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-white">✨ Latest</h2>
        <a routerLink="/marketplace" [queryParams]="{sort: 'latest'}"
           class="text-brand-400 text-sm hover:text-brand-300">View all →</a>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        @for (skill of latest(); track skill.id) {
          <sh-skill-card [skill]="skill" (install)="onInstall($event)" />
        }
      </div>
    </section>

    <!-- Featured Collections -->
    @if (collections().length) {
      <section class="max-w-7xl mx-auto px-4 py-8">
        <h2 class="text-lg font-semibold text-white mb-6">📦 Featured Collections</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          @for (col of collections(); track col.id) {
            <a [routerLink]="['/marketplace']" [queryParams]="{collection: col.slug}"
               class="card p-5 hover:border-brand-500/50 transition-colors group">
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-white font-semibold group-hover:text-brand-400 transition-colors">
                  {{ col.name }}
                </h3>
                <span class="badge bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  {{ col.skills.length }} skills
                </span>
              </div>
              <p class="text-gray-400 text-sm mb-3">{{ col.description }}</p>
              <div class="flex gap-1 flex-wrap">
                @for (skill of col.skills.slice(0, 4); track skill.id) {
                  <span class="badge bg-surface-700 text-gray-300 text-xs">{{ skill.name }}</span>
                }
              </div>
            </a>
          }
        </div>
      </section>
    }

    <!-- CTA -->
    <section class="max-w-7xl mx-auto px-4 py-16">
      <div class="rounded-2xl bg-gradient-to-r from-brand-500/20 to-indigo-500/10 border border-brand-500/20 p-10 text-center">
        <h2 class="text-2xl font-bold text-white mb-3">Have a skill to share?</h2>
        <p class="text-gray-400 mb-6">Publish your AI agent skill and reach thousands of developers.</p>
        <a routerLink="/publish" class="btn-primary px-6 py-3 text-base">Publish your Skill</a>
      </div>
    </section>
  `,
})
export class HomeComponent implements OnInit {
  private skillService      = inject(SkillService);
  private collectionService = inject(CollectionService);

  trending    = signal<SkillSummary[]>([]);
  latest      = signal<SkillSummary[]>([]);
  collections = signal<Collection[]>([]);
  categories  = signal<Category[]>([]);
  loading     = signal(true);

  ngOnInit() {
    this.skillService.trending(0, 8).subscribe(p => { this.trending.set(p.content); this.loading.set(false); });
    this.skillService.latest(0, 8).subscribe(p => this.latest.set(p.content));
    this.collectionService.featured().subscribe(c => this.collections.set(c));
    this.collectionService.categories().subscribe(c => this.categories.set(c));
  }

  onInstall(skill: SkillSummary) {
    this.skillService.install(skill.id).subscribe();
  }

  catIcon(icon: string): string {
    const map: Record<string, string> = {
      code: '💻', layout: '🎨', server: '🖥️', cloud: '☁️',
      'check-circle': '✅', cpu: '🤖', shield: '🛡️', 'pen-tool': '✍️',
    };
    return map[icon] ?? '📦';
  }
}
