import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, Collection } from '../models/collection.model';
import { Page } from '../models/skill.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CollectionService {
  private http = inject(HttpClient);

  featured(): Observable<Collection[]> {
    return this.http.get<Collection[]>(`${environment.apiUrl}/collections/featured`);
  }

  list(page = 0, size = 12): Observable<Page<Collection>> {
    return this.http.get<Page<Collection>>(`${environment.apiUrl}/collections`, {
      params: { page, size }
    });
  }

  detail(slug: string): Observable<Collection> {
    return this.http.get<Collection>(`${environment.apiUrl}/collections/${slug}`);
  }

  categories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories`);
  }
}
