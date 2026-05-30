import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkillSummary } from '../../../core/models/skill.model';

@Component({
  selector: 'sh-skill-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="card group cursor-pointer" [routerLink]="['/skills', skill.slug]">
      <!-- Thumbnail -->
      <div class="h-32 bg-gradient-to-br from-brand-500/20 to-surface-700 relative overflow-hidden">
        @if (skill.thumbnailUrl) {
          <img [src]="skill.thumbnailUrl" [alt]="skill.name" class="w-full h-full object-cover">
        } @else {
          <div class="w-full h-full flex items-center justify-center">
            <span class="text-4xl">⚡</span>
          </div>
        }
        <!-- Category badge -->
        @if (skill.categoryName) {
          <span class="absolute top-2 left-2 badge bg-surface-900/80 text-gray-300 border border-gray-700">
            {{ skill.categoryName }}
          </span>
        }
      </div>

      <!-- Body -->
      <div class="p-4">
        <h3 class="text-white font-semibold text-sm mb-1 line-clamp-1 group-hover:text-brand-400 transition-colors">
          {{ skill.name }}
        </h3>
        <p class="text-gray-400 text-xs mb-3 line-clamp-2">{{ skill.description }}</p>

        <!-- Tags -->
        <div class="flex flex-wrap gap-1 mb-3">
          @for (tag of skill.tags.slice(0, 3); track tag) {
            <span class="badge bg-surface-700 text-gray-300">{{ tag }}</span>
          }
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between">
          <span class="text-gray-500 text-xs">by {{ skill.authorUsername }}</span>
          <div class="flex items-center gap-3">
            @if (skill.aiScore) {
              <span class="text-xs text-brand-400 font-medium">★ {{ skill.aiScore | number:'1.1-1' }}</span>
            }
            <span class="text-xs text-gray-500">{{ skill.installCount | number }} installs</span>
          </div>
        </div>
      </div>

      <!-- Install button (hover) -->
      <div class="px-4 pb-4">
        <button
          (click)="install.emit(skill); $event.stopPropagation()"
          class="w-full btn-primary text-xs justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          Install Skill
        </button>
      </div>
    </div>
  `,
})
export class SkillCardComponent {
  @Input({ required: true }) skill!: SkillSummary;
  @Output() install = new EventEmitter<SkillSummary>();
}
