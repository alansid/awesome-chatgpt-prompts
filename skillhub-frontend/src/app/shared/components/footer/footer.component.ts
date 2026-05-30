import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sh-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="border-t border-gray-800 mt-20 py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          <div>
            <h4 class="text-white font-semibold mb-3 text-sm">Platform</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a routerLink="/marketplace" class="hover:text-white transition-colors">Marketplace</a></li>
              <li><a routerLink="/playground" class="hover:text-white transition-colors">Playground</a></li>
              <li><a routerLink="/publish" class="hover:text-white transition-colors">Publish Skill</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-semibold mb-3 text-sm">Developers</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">API Docs</a></li>
              <li><a href="#" class="hover:text-white transition-colors">CLI Tool</a></li>
              <li><a href="#" class="hover:text-white transition-colors">SDK</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-semibold mb-3 text-sm">Supported Agents</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li>Claude Code</li>
              <li>Cursor</li>
              <li>Copilot · Cline · Windsurf</li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-semibold mb-3 text-sm">Legal</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

        </div>
        <div class="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p class="text-gray-500 text-sm">© 2026 SkillHub. All rights reserved.</p>
          <p class="text-gray-600 text-xs">Built with Angular 20 + Spring Boot 4.0</p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
