import { Component, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { CanvasComponent } from '../canvas/canvas.component';
import { CanvasService } from '../canvas.service';

@Component({
  selector: 'app-drawingframe',
  templateUrl: './drawingframe.component.html',
  styleUrls: ['./drawingframe.component.scss']
})
export class DrawingFrameComponent implements AfterViewInit {

  @ViewChild (CanvasComponent) public canvas: CanvasComponent;

  public ngAfterViewInit() {
    this.pixels.selected$.subscribe ( (event:CanvasComponent) => {
        if ( event != null ) {
            event.copyTo( this.canvas );
        }
    });
  }

  constructor(private pixels: CanvasService){
  }

  ngOnInit() {
  }

}
