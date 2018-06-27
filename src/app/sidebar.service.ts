import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SidebarService {

  public TOOLS = {
    UNKNOWN : { value: -1, name: "Unknown" },
    BRUSH : { value: 0, name: "Brush" },
    ERASER: { value: 1, name: "Eraser" }
  };

  public clearCanvas$ = new Subject<any>();
  public tool$ = new BehaviorSubject<any>(this.TOOLS.BRUSH);
  public saveCanvases$ = new Subject<any>();
  public loadCanvases$ = new Subject<any>();

  constructor() { 
  }

  clearCanvas() {
    this.clearCanvas$.next();
  }

  saveCanvases(filename:string) {
    this.saveCanvases$.next(filename);
  }

  changeTool(event:any){

    var tool = this.TOOLS.UNKNOWN;
    switch ( parseInt(event) ) {
        case 0:
            tool = this.TOOLS.BRUSH;
            break;
        case 1:
            tool = this.TOOLS.ERASER;
            break;
        default:
            console.log ( "Bad Tool Selected: " + this.TOOLS.UNKNOWN.name );
            break;
    }

    if ( tool.value == -1 ){
        return;
    }

    this.tool$.next(tool);
  }

  public loadCanvasDataFromFile(event) {
    this.loadCanvases$.next(event);
  }
}
