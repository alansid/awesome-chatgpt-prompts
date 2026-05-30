import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateSkillRequest, Page, SkillDetail, SkillSummary } from '../models/skill.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SkillService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/skills`;

  list(params: { categoryId?: number; sort?: string; page?: number; size?: number } = {}): Observable<Page<SkillSummary>> {
    let p = new HttpParams();
    if (params.categoryId) p = p.set('categoryId', params.categoryId);
    if (params.sort)       p = p.set('sort', params.sort);
    if (params.page != null) p = p.set('page', params.page);
    if (params.size != null) p = p.set('size', params.size);
    return this.http.get<Page<SkillSummary>>(this.base, { params: p });
  }

  search(q: string, page = 0, size = 20): Observable<Page<SkillSummary>> {
    return this.http.get<Page<SkillSummary>>(`${this.base}/search`, {
      params: new HttpParams().set('q', q).set('page', page).set('size', size)
    });
  }

  trending(page = 0, size = 20): Observable<Page<SkillSummary>> {
    return this.http.get<Page<SkillSummary>>(`${this.base}/trending`, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  latest(page = 0, size = 20): Observable<Page<SkillSummary>> {
    return this.http.get<Page<SkillSummary>>(`${this.base}/latest`, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  detail(slug: string): Observable<SkillDetail> {
    return this.http.get<SkillDetail>(`${this.base}/${slug}`);
  }

  create(req: CreateSkillRequest): Observable<SkillDetail> {
    return this.http.post<SkillDetail>(this.base, req);
  }

  publish(id: number): Observable<SkillDetail> {
    return this.http.post<SkillDetail>(`${this.base}/${id}/publish`, {});
  }

  install(id: number): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/install`, {});
  }

  toggleFavorite(id: number): Observable<{ favorited: boolean }> {
    return this.http.post<{ favorited: boolean }>(`${this.base}/${id}/favorite`, {});
  }

  favorites(page = 0, size = 20): Observable<Page<SkillSummary>> {
    return this.http.get<Page<SkillSummary>>(`${this.base}/favorites`, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  mySkills(page = 0, size = 20): Observable<Page<SkillSummary>> {
    return this.http.get<Page<SkillSummary>>(`${environment.apiUrl}/users/me/skills`, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }
}
