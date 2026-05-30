import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { SkillService } from '../../core/services/skill.service';
import { CollectionService } from '../../core/services/collection.service';
import { SkillCardComponent } from '../../shared/components/skill-card/skill-card.component';
import { SkillSummary, Page } from '../../core/models/skill.model';
import { Category } from '../../core/models/collection.model';

@Component({
  selector: 'sh-marketplace',
  standalone: true,
  imports: [RouterLink, FormsModule, SkillCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Skills Marketplace</h1>
        <p class="text-gray-400">Discover 10,000+ AI-evaluated skills for your coding agent.</p>
      </div>

      <!-- Search + Filters -->
      <div class="flex flex-col md:flex-row gap-3 mb-8">
        <div class="flex-1 relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input [(ngModel)]="searchQuery" (ngModelChange)="onSearch($event)"
                 placeholder="Search skills…"
                 class="input pl-9" />
        </div>

        <!-- Category filter -->
        <select [(ngModel)]="selectedCategory" (ngModelChange)="onCategoryChange()"
                class="input w-full md:w-48">
          <option [ngValue]="null">All Categories</option>
          @for (cat of categories(); track cat.id) {
            <option [ngValue]="cat.id">{{ cat.name }}</option>
          }
        </select>

        <!-- Sort -->
        <select [(ngModel)]="sort" (ngModelChange)="onSortChange()"
                class="input w-full md:w-40">
          <option value="trending">Trending</option>
          <option value="latest">Latest</option>
          <option value="installs">Most Installed</option>
        </select>
      </div>

      <!-- Sort tabs -->
      <div class="flex gap-2 mb-6 border-b border-gray-800 pb-3">
        @for (tab of tabs; track tab.value) {
          <button (click)="setTab(tab.value)"
                  [class.text-white]="activeTab() === tab.value"
                  [class.border-b-2]="activeTab() === tab.value"
                  [class.border-brand-500]="activeTab() === tab.value"
                  class="px-3 pb-3 text-sm text-gray-400 hover:text-white transition-colors -mb-px">
            {{ tab.label }}
          </button>
        }
      </div>

      <!-- Grid -->
      @if (loading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (i of [1,2,3,4,5,6,7,8]; track i) {
            <div class="card h-64 animate-pulse bg-surface-700"></div>
          }
        </div>
      } @else if (skills().length === 0) {
        <div class="text-center py-20 text-gray-500">
          <p class="text-4xl mb-3">🔍</p>
          <p>No skills found. Try a different search.</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          @for (skill of skills(); track skill.id) {
            <sh-skill-card [skill]="skill" (install)="onInstall($event)" />
          }
        </div>

        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="flex items-center justify-center gap-2">
            <button (click)="prevPage()" [disabled]="currentPage() === 0"
                    class="btn-secondary px-3 py-1.5 text-xs disabled:opacity-30">← Prev</button>
            <span class="text-gray-400 text-sm">{{ currentPage() + 1 }} / {{ totalPages() }}</span>
            <button (click)="nextPage()" [disabled]="currentPage() + 1 >= totalPages()"
                    class="btn-secondary px-3 py-1.5 text-xs disabled:opacity-30">Next →</button>
          </div>
        }
      }
    </div>
  `,
})
export class MarketplaceComponent implements OnInit {
  private skillService      = inject(SkillService);
  private collectionService = inject(CollectionService);
  private route             = inject(ActivatedRoute);

  skills        = signal<SkillSummary[]>([]);
  categories    = signal<Category[]>([]);
  loading       = signal(true);
  currentPage   = signal(0);
  totalPages    = signal(1);
  activeTab     = signal('trending');

  searchQuery       = '';
  selectedCategory: number | null = null;
  sort              = 'trending';

  private search$ = new Subject<string>();

  tabs = [
    { label: '🔥 Trending', value: 'trending' },
    { label: '✨ Latest',   value: 'latest'   },
    { label: '⬇️ Most Installed', value: 'installs' },
  ];

  ngOnInit() {
    this.collectionService.categories().subscribe(c => this.categories.set(c));

    this.route.queryParams.subscribe(params => {
      if (params['category']) this.selectedCategory = +params['category'];
      if (params['sort']) this.sort = params['sort'];
      this.load();
    });

    this.search$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(q => {
        this.loading.set(true);
        return q ? this.skillService.search(q, this.currentPage()) : this.loadObservable();
      })
    ).subscribe(p => this.setPage(p));
  }

  onSearch(q: string) { this.currentPage.set(0); this.search$.next(q); }
  onCategoryChange()  { this.currentPage.set(0); this.load(); }
  onSortChange()      { this.currentPage.set(0); this.activeTab.set(this.sort); this.load(); }
  setTab(v: string)   { this.sort = v; this.activeTab.set(v); this.currentPage.set(0); this.load(); }
  prevPage()          { this.currentPage.update(p => p - 1); this.load(); }
  nextPage()          { this.currentPage.update(p => p + 1); this.load(); }
  onInstall(s: SkillSummary) { this.skillService.install(s.id).subscribe(); }

  private load() {
    this.loading.set(true);
    this.loadObservable().subscribe(p => this.setPage(p));
  }

  private loadObservable() {
    return this.skillService.list({
      categoryId: this.selectedCategory ?? undefined,
      sort: this.sort,
      page: this.currentPage(),
      size: 20,
    });
  }

  private setPage(p: any) {
    this.skills.set(p.content);
    this.totalPages.set(p.totalPages);
    this.loading.set(false);
  }
}
