import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaletteService {

  brushSize$ = new BehaviorSubject<any>(1);
  color$ = new BehaviorSubject<any>(0);
  layer$ = new BehaviorSubject<any>(1);

  constructor() { 
  }

  changeBrushSize(event) {
    this.brushSize$.next (event);
  }

  changeColor(event) {
    this.color$.next (event);
  }

  changeLayer(event) {
    this.layer$.next (event);
  }
}
