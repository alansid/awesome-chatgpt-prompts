import { Component, OnInit, inject, signal, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SkillService } from '../../core/services/skill.service';
import { SkillDetail, SkillSummary } from '../../core/models/skill.model';

interface Message { role: 'user' | 'assistant'; content: string; }

@Component({
  selector: 'sh-playground',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="h-[calc(100vh-56px)] flex">

      <!-- Sidebar: skill picker -->
      <aside class="w-64 border-r border-gray-800 bg-surface-800 flex flex-col shrink-0 hidden md:flex">
        <div class="p-4 border-b border-gray-800">
          <p class="text-white font-semibold text-sm">Skills</p>
          <input [(ngModel)]="sidebarSearch" (ngModelChange)="searchSkills()"
                 placeholder="Search…" class="input mt-2 text-xs py-1.5" />
        </div>
        <div class="flex-1 overflow-y-auto p-2 space-y-1">
          @for (skill of sidebarSkills(); track skill.id) {
            <button (click)="selectSkill(skill)"
                    [class.bg-brand-500/10]="activeSkill()?.id === skill.id"
                    [class.border-brand-500/30]="activeSkill()?.id === skill.id"
                    class="w-full text-left p-2.5 rounded-lg border border-transparent hover:bg-white/5 transition-colors">
              <p class="text-white text-xs font-medium line-clamp-1">{{ skill.name }}</p>
              <p class="text-gray-500 text-xs mt-0.5 line-clamp-1">{{ skill.categoryName }}</p>
            </button>
          }
        </div>
      </aside>

      <!-- Chat area -->
      <div class="flex-1 flex flex-col min-w-0">

        <!-- Header -->
        <div class="border-b border-gray-800 p-4 flex items-center justify-between">
          @if (activeSkill()) {
            <div>
              <p class="text-white font-medium text-sm">{{ activeSkill()!.name }}</p>
              <p class="text-gray-500 text-xs">Skill active · Using SkillHub credits</p>
            </div>
          } @else {
            <p class="text-gray-400 text-sm">Select a skill from the sidebar to begin</p>
          }
          @if (activeSkill()) {
            <a [routerLink]="['/skills', activeSkill()!.slug]"
               class="text-brand-400 text-xs hover:text-brand-300">View skill →</a>
          }
        </div>

        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          @if (messages().length === 0) {
            <div class="h-full flex flex-col items-center justify-center text-center text-gray-500">
              <p class="text-5xl mb-4">⚡</p>
              <p class="font-medium text-gray-400">SkillHub Playground</p>
              <p class="text-sm mt-1">Select a skill and start chatting to test it instantly.</p>
            </div>
          }
          @for (msg of messages(); track $index) {
            <div [class.justify-end]="msg.role === 'user'" class="flex gap-3"
                 [class.flex-row-reverse]="msg.role === 'user'">
              <div class="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
                   [class.bg-brand-500]="msg.role === 'user'"
                   [class.bg-surface-700]="msg.role === 'assistant'">
                {{ msg.role === 'user' ? 'U' : 'AI' }}
              </div>
              <div class="max-w-lg px-4 py-2.5 rounded-2xl text-sm"
                   [class.bg-brand-500]="msg.role === 'user'"
                   [class.text-white]="msg.role === 'user'"
                   [class.bg-surface-700]="msg.role === 'assistant'"
                   [class.text-gray-200]="msg.role === 'assistant'">
                <pre class="whitespace-pre-wrap font-sans">{{ msg.content }}</pre>
              </div>
            </div>
          }
          @if (thinking()) {
            <div class="flex gap-3">
              <div class="w-7 h-7 rounded-full bg-surface-700 flex items-center justify-center text-xs">AI</div>
              <div class="bg-surface-700 rounded-2xl px-4 py-2.5">
                <span class="inline-flex gap-1">
                  <span class="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style="animation-delay:0ms"></span>
                  <span class="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style="animation-delay:150ms"></span>
                  <span class="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style="animation-delay:300ms"></span>
                </span>
              </div>
            </div>
          }
        </div>

        <!-- Input -->
        <div class="border-t border-gray-800 p-4">
          <div class="flex gap-3">
            <textarea [(ngModel)]="inputText"
                      (keydown.enter)="$event.preventDefault(); send()"
                      [disabled]="!activeSkill()"
                      placeholder="{{ activeSkill() ? 'Ask anything…' : 'Select a skill first' }}"
                      rows="1"
                      class="input flex-1 resize-none">
            </textarea>
            <button (click)="send()" [disabled]="!activeSkill() || !inputText.trim() || thinking()"
                    class="btn-primary px-4 disabled:opacity-40">
              Send
            </button>
          </div>
          <p class="text-gray-600 text-xs mt-2 text-center">
            Press Enter to send · Responses use simulated demo mode in this build
          </p>
        </div>
      </div>
    </div>
  `,
})
export class PlaygroundComponent implements OnInit {
  @Input() slug?: string;

  private skillService = inject(SkillService);

  sidebarSkills = signal<SkillSummary[]>([]);
  activeSkill   = signal<SkillSummary | null>(null);
  messages      = signal<Message[]>([]);
  thinking      = signal(false);

  sidebarSearch = '';
  inputText     = '';

  ngOnInit() {
    this.skillService.trending(0, 30).subscribe(p => {
      this.sidebarSkills.set(p.content);
      if (this.slug) {
        const found = p.content.find(s => s.slug === this.slug);
        if (found) this.selectSkill(found);
      }
    });
  }

  selectSkill(skill: SkillSummary) {
    this.activeSkill.set(skill);
    this.messages.set([{
      role: 'assistant',
      content: `Hi! I'm using the "${skill.name}" skill. How can I help you today?`,
    }]);
  }

  searchSkills() {
    if (!this.sidebarSearch.trim()) {
      this.skillService.trending(0, 30).subscribe(p => this.sidebarSkills.set(p.content));
    } else {
      this.skillService.search(this.sidebarSearch, 0, 20).subscribe(p => this.sidebarSkills.set(p.content));
    }
  }

  send() {
    const text = this.inputText.trim();
    if (!text || !this.activeSkill()) return;
    this.messages.update(m => [...m, { role: 'user', content: text }]);
    this.inputText = '';
    this.thinking.set(true);

    setTimeout(() => {
      this.messages.update(m => [...m, {
        role: 'assistant',
        content: `[Demo mode] Skill "${this.activeSkill()!.name}" received your message:\n\n"${text}"\n\nIn production, this connects to a real AI model with the skill's instructions loaded.`,
      }]);
      this.thinking.set(false);
    }, 1200);
  }
}
