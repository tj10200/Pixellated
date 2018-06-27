import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

export class PixelData {
    x: number;
    y: number;

    constructor( x:number, y:number, width:number, height:number ) {
        this.x = x / width;
        this.y = y / height;
    }
}

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  pixelData$ = new BehaviorSubject<PixelData>({x:0,y:0});

  constructor() { 
  }

  publishPixelData(event:PixelData) {
    this.pixelData$.next (event);
  }

}
