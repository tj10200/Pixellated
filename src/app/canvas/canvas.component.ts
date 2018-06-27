import { Component, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { PaletteService } from '../palette.service';
import { SidebarService } from '../sidebar.service';
import { PixelData, CanvasService } from '../canvas.service';
import { Observable, fromEvent } from 'rxjs';
import { takeUntil, pairwise, switchMap, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-canvas',
  template: '<canvas #childcanvas id="{{canvasname}}"></canvas>',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {

  @ViewChild ('childcanvas') public canvas: any;
  @Input() public canvasname: string = "canvas_0";
  @Input() public width: number = 100;
  @Input() public height: number = 100;
  @Input() public pixelwidth: number = 25;
  @Input() public pixelheight: number = 25;
  @Input() public drawable: boolean = false;

  private cx: CanvasRenderingContext2D;
  private canvasEl: HTMLCanvasElement;
  private gridsize: any;
  private tool: any;

  constructor(private palette: PaletteService,
              private sidebar: SidebarService,
              private pixels: CanvasService) { 
  }

  public ngAfterViewInit() {
    this.gridsize = { x: this.width / this.pixelwidth, y: this.height / this.pixelheight};
    this.canvasEl = this.canvas.nativeElement;
    this.cx = this.canvasEl.getContext('2d');

    this.canvasEl.width = this.width;
    this.canvasEl.height = this.height;

    this.palette.brushSize$
        .subscribe ( (v) => this.cx.lineWidth = v);

    this.cx.lineCap = 'square';

    this.palette.color$
        .subscribe ( (v) => {
            this.cx.strokeStyle = this.cx.fillStyle = v
        });

    if ( this.drawable ) {
        this.sidebar.clearCanvas$
            .subscribe ( () => { 
                this.clearCanvas();
            });
    }

    this.sidebar.tool$
        .subscribe ( (event: {value:number, name:string}) => {
            if ( event == this.sidebar.TOOLS.BRUSH ) {
                this.tool = this.sidebar.TOOLS.BRUSH;
            }
            else if ( event == this.sidebar.TOOLS.ERASER ) {
                this.tool = this.sidebar.TOOLS.ERASER;
            }
        });

    this.captureEvents(this.canvasEl);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {

      if ( !this.drawable ) {
        return;
      }

      var mousemovement = fromEvent(canvasEl, 'mousedown')

      mousemovement.pipe ( 
        switchMap((x:any) => {
            return fromEvent(canvasEl, 'mousemove').pipe(
            takeUntil(fromEvent(canvasEl, 'mouseup')),
            takeUntil(fromEvent(canvasEl, 'mouseleave')),
            pairwise())
      }))
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        var curPos = new PixelData(res[1].clientX - rect.left,
                                   res[1].clientY - rect.top,
                                   1, 1);

        this.drawOnCanvas(curPos);
        this.pixels.publishPixelData(
                new PixelData(curPos.x,curPos.y,this.width,this.height));
        });

      fromEvent(canvasEl, 'click').pipe (
        map ( (event: MouseEvent) => ({ 
            clientX: event.clientX, 
            clientY: event.clientY 
        }))
      ).subscribe ( val => {

        const rect = canvasEl.getBoundingClientRect();

        var curPos = new PixelData(val.clientX - rect.left,
                                   val.clientY - rect.top,
                                   1, 1);

        this.drawOnCanvas(curPos);
        this.pixels.publishPixelData(
                new PixelData(curPos.x,curPos.y,this.width,this.height));
      })

  }

  public copyAndDrawEvent(event:PixelData) {
    var newPos = new PixelData(event.x, event.y, 1, 1);
    newPos.x *= this.width;
    newPos.y *= this.height;

    this.drawOnCanvas(newPos);
  }

  private drawOnCanvas(data:PixelData) {

    if (!this.cx) { 
        return;
    }

    this.cx.beginPath();

    //TODO: To fill in the gaps when moving the cursor quickly, need to actually
    // plot and follow the diff between prevPos and curPos.

    var x = Math.floor( data.x / this.gridsize.x );
    x *= this.gridsize.x;
    var y = Math.floor( data.y / this.gridsize.y );
    y *= this.gridsize.y;

    if ( this.tool == this.sidebar.TOOLS.BRUSH ){
        this.drawRect( x, y, this.gridsize.x, this.gridsize.y );
    }
    else if ( this.tool == this.sidebar.TOOLS.ERASER ) {
        this.clearRect( x, y, this.gridsize.x, this.gridsize.y );
    }
  }

  private drawRect ( x, y, w, h )
  {
    this.cx.rect( x, y, w, h );
    this.cx.fill();
  }

  private clearRect ( x, y, w, h )
  {
    this.cx.clearRect(x, y, w, h); 
  }

  public selectCanvas() {
    this.canvas.nativeElement.style="border: 3px solid #000;";
    this.pixels.selectCanvas(this);
  }

  public deselectCanvas() {
    this.canvas.nativeElement.style="border: 1px solid #000;";
  }

  public copyTo(other:CanvasComponent) {
    other.cx.clearRect(0, 0, other.width, other.height);
    other.cx.imageSmoothingEnabled = false;
    other.cx.drawImage( this.canvasEl, 0, 0, other.width, other.height);
  }

  public clearCanvas() {
    this.clearRect ( 0, 0, this.canvasEl.width, this.canvasEl.height);
  }

  public changeTool() {
    
  }

  public getDataURL() {
    return this.canvasEl.toDataURL("image/png");
  }

  public drawFromJson(imagejson){
    var img = new Image();

    this.clearCanvas();

    var component = this;
    return new Promise(function(resolve, reject) {
        img.onload = function(){
            component.cx.drawImage(img, 0, 0);
            resolve(component);
        };
        img.onerror = reject
        img.src = imagejson;
    });

  }

  public getNativeElement(){
    return this.canvasEl;
  }

}
