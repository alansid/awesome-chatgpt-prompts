import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SkillService } from '../../core/services/skill.service';
import { CollectionService } from '../../core/services/collection.service';
import { Category } from '../../core/models/collection.model';
import { CreateSkillRequest } from '../../core/models/skill.model';

const AGENTS = ['Claude Code', 'Cursor', 'Codex CLI', 'Gemini CLI', 'OpenCode',
                'Windsurf', 'Cline', 'Roo Code', 'Copilot'];

@Component({
  selector: 'sh-publish',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-10">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white">Publish a Skill</h1>
        <p class="text-gray-400 mt-1">Share your AI agent skill with the community.</p>
      </div>

      <form (ngSubmit)="submit()" class="space-y-6">

        <!-- Name -->
        <div>
          <label class="block text-sm text-gray-400 mb-1.5">Skill Name <span class="text-red-400">*</span></label>
          <input [(ngModel)]="form.name" name="name" required maxlength="200"
                 class="input" placeholder="e.g. TypeScript TDD Expert" />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm text-gray-400 mb-1.5">Short Description <span class="text-red-400">*</span></label>
          <textarea [(ngModel)]="form.description" name="description" required rows="2"
                    class="input resize-none"
                    placeholder="One-line description of what this skill does."></textarea>
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm text-gray-400 mb-1.5">Category</label>
          <select [(ngModel)]="form.categoryId" name="categoryId" class="input">
            <option [ngValue]="undefined">— None —</option>
            @for (cat of categories(); track cat.id) {
              <option [ngValue]="cat.id">{{ cat.name }}</option>
            }
          </select>
        </div>

        <!-- Version -->
        <div>
          <label class="block text-sm text-gray-400 mb-1.5">Version <span class="text-red-400">*</span></label>
          <input [(ngModel)]="form.version" name="version" required
                 class="input w-32" placeholder="1.0.0" />
        </div>

        <!-- Compatible agents -->
        <div>
          <label class="block text-sm text-gray-400 mb-2">Compatible Agents</label>
          <div class="flex flex-wrap gap-2">
            @for (agent of agentList; track agent) {
              <button type="button" (click)="toggleAgent(agent)"
                      [class.bg-brand-500]="isAgentSelected(agent)"
                      [class.border-brand-500]="isAgentSelected(agent)"
                      [class.text-white]="isAgentSelected(agent)"
                      class="px-3 py-1 rounded-full border border-gray-700 text-gray-400 text-xs hover:border-brand-500 transition-colors">
                {{ agent }}
              </button>
            }
          </div>
        </div>

        <!-- Skill content (SKILL.md) -->
        <div>
          <label class="block text-sm text-gray-400 mb-1.5">
            Skill Content (SKILL.md) <span class="text-red-400">*</span>
          </label>
          <p class="text-xs text-gray-600 mb-2">
            Write the instructions that will guide the AI agent. Markdown supported.
          </p>
          <textarea [(ngModel)]="form.content" name="content" required rows="12"
                    class="input font-mono text-xs resize-y"
                    placeholder="# My Skill&#10;&#10;You are an expert in...&#10;&#10;## Guidelines&#10;&#10;- Always..."></textarea>
        </div>

        @if (error()) {
          <div class="rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3">{{ error() }}</div>
        }
        @if (success()) {
          <div class="rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3">
            ✓ Skill saved as draft! You can publish it from your account page.
          </div>
        }

        <div class="flex gap-3">
          <button type="submit" [disabled]="loading()" class="btn-primary px-6 py-2.5">
            @if (loading()) { Saving… } @else { Save Draft }
          </button>
          <a routerLink="/account" class="btn-secondary px-6 py-2.5">Cancel</a>
        </div>

      </form>
    </div>
  `,
})
export class PublishComponent implements OnInit {
  private skillService      = inject(SkillService);
  private collectionService = inject(CollectionService);
  private router            = inject(Router);

  categories = signal<Category[]>([]);
  loading    = signal(false);
  error      = signal('');
  success    = signal(false);

  agentList = AGENTS;
  form: CreateSkillRequest = {
    name: '', description: '', content: '',
    version: '1.0.0', compatibleAgents: [],
  };

  ngOnInit() {
    this.collectionService.categories().subscribe(c => this.categories.set(c));
  }

  toggleAgent(agent: string) {
    const agents = this.form.compatibleAgents;
    const idx = agents.indexOf(agent);
    this.form.compatibleAgents = idx >= 0
      ? agents.filter(a => a !== agent)
      : [...agents, agent];
  }

  isAgentSelected(agent: string) {
    return this.form.compatibleAgents.includes(agent);
  }

  submit() {
    this.loading.set(true);
    this.error.set('');
    this.skillService.create(this.form).subscribe({
      next: () => { this.success.set(true); this.loading.set(false); },
      error: err => {
        this.error.set(err.error?.detail || 'Failed to save skill.');
        this.loading.set(false);
      },
    });
  }
}
