import { Component, OnInit, Input, ElementRef, AfterViewInit, ViewChildren, QueryList, Directive} from '@angular/core';
import { CanvasComponent } from '../canvas/canvas.component';
import { PixelData, CanvasService } from '../canvas.service';
import { SidebarService } from '../sidebar.service';
import { AnimationService } from '../animation.service';
import { FramesService } from '../frames.service';
import { Http, Headers, Response } from '@angular/http';
import { saveAs } from 'file-saver/FileSaver';

@Component({
  selector: 'app-frames',
  templateUrl: './frames.component.html',
  styleUrls: ['./frames.component.scss']
})
export class FramesComponent implements OnInit {

  
  @ViewChildren (CanvasComponent) public canvases: QueryList<CanvasComponent>;
    
  frames = "1,2,3,4,5,6,7,8,9,10";
  selected = 0;

  constructor(private data: CanvasService,
              private sidebar: SidebarService,
              private animation: AnimationService) { 
  }

  ngOnInit() {
  }

  public ngAfterViewInit() {
    this.canvases.toArray()[this.selected].selectCanvas();
    this.data.pixelData$.subscribe (
        (event : PixelData) => {
           this.canvases.toArray()[this.selected].copyAndDrawEvent(event);
    });

    this.sidebar.clearCanvas$
        .subscribe ( () => { 
            this.canvases.toArray()[this.selected].clearCanvas();
        });

    //The initial pixeldata observable will trigger a {0,0} pixel draw event
    //need to clear it out
    this.canvases.toArray()[this.selected].clearCanvas();

    this.animation.setCanvases( this.canvases );

    this.sidebar.saveCanvases$
        .subscribe ( (filename:string) => { 
            this.saveCanvasData(filename);
        });

    this.sidebar.loadCanvases$
        .subscribe ( (jsondata) => {
            this.loadCanvasData(jsondata);
        });
  }

  private select_frame(canvasEl){
    this.canvases.toArray()[this.selected].deselectCanvas();
    this.selected = parseInt(canvasEl.id,10) - 1;
    this.canvases.toArray()[this.selected].selectCanvas();
  }

  private saveCanvasData(filename:string) {

    var imgData = [];
    this.canvases.toArray().forEach(function(canvas) {
        imgData.push ( canvas.getDataURL() );
    }, this );

    var jsondata = JSON.stringify({
        images: imgData
    });
    
    var blob = new Blob([jsondata], {type: "application/json"});
    saveAs(blob, filename);
  }

  private loadCanvasData(jsondata){

    for ( var i = 0; i < jsondata.images.length; ++i ) {
        var jsonimg = jsondata.images[i];
        var canvas = this.canvases.toArray()[i];
        canvas.drawFromJson(jsonimg)
            .then( (canvas:CanvasComponent) => {
                console.log ( "Loaded " + canvas.getNativeElement() );

                if ( canvas == this.canvases.toArray()[0] ) {
                    console.log ( "selecting " + canvas.getNativeElement() );
                    this.select_frame( canvas.getNativeElement() );
                }
        });
    }
  }
}
