import { Injectable, QueryList } from '@angular/core';
import { CanvasComponent } from './canvas/canvas.component';

@Injectable({
  providedIn: 'root'
})
export class AnimationService{

  public canvases: QueryList<CanvasComponent>;

  constructor() { }

  public setCanvases(c:QueryList<CanvasComponent>){
    this.canvases = c;
  }

  public getCanvases() {
    return this.canvases;
  }

}
