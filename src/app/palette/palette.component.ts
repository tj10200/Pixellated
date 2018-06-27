import { Component, OnInit, ViewChild, QueryList } from '@angular/core';
import { PaletteService } from '../palette.service';
import { AnimationService } from '../animation.service';
import { CanvasComponent } from '../canvas/canvas.component';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss']
})
export class PaletteComponent implements OnInit {

  @ViewChild (CanvasComponent) private animationcanvas: CanvasComponent;
  private layer = 1;
  private color = 0;
  private palette: number[];
  private brushStyle;
  private playAnimation = false;
  private animationTiles = [
    {num: 1, selected:false},
    {num: 2, selected:false},
    {num: 3, selected:false},
    {num: 4, selected:false},
    {num: 5, selected:false},
    {num: 6, selected:false},
    {num: 7, selected:false},
    {num: 8, selected:false},
    {num: 9, selected:false},
    {num: 10, selected:false},
  ];
  private vendors = ['webkit', 'moz'];
  private fps          =    30;
  private interval     =    1000/this.fps;
  private lastTime     =    (new Date()).getTime();
  private currentTime  =    0;
  private delta        =    0;
  private index        =    0;

  constructor(private data: PaletteService,
              public animationdata: AnimationService ) { 
  }

  ngOnInit() {
    this.setColorStyle();
  }

  changeColor(event) {
    this.data.changeColor(event);
  }

  changeLayer(event) {
    this.data.changeLayer(event);
  }

  setColorStyle() {
    this.data.changeColor(this.color);
    return {
        'border-radius': '30px',
        'background-color': '' + this.color + '',
        'width': '50px',
        'height': '20px',
        'padding': '1px'
    };

  }

  startAnimation(event:any) {
    this.playAnimation = event.checked;
    if ( event.checked == true ) {
        this.animationLoop();
    }
  }

  animationLoop() {
    if ( this.playAnimation == true ) {
      requestAnimationFrame(this.animationLoop.bind(this));

      this.currentTime = (new Date()).getTime();
      this.delta = (this.currentTime-this.lastTime);

      if(this.delta > this.interval) {
        //Animation goes here
        this.lastTime = this.currentTime - (this.delta % this.interval);

        var tile = this.animationTiles[ this.index ];
        if ( tile.selected ) {
            var framecanvas = this.animationdata.getCanvases().toArray()[ tile.num - 1 ];
            framecanvas.copyTo ( this.animationcanvas );
        }
        else {
            while ( ++this.index < this.animationTiles.length ) {
                if ( this.animationTiles[ this.index ].selected ) {
                    --this.index;
                    break;
                }
            }

        }

        if ( ++this.index >= this.animationTiles.length ) {
            this.index = 0;
        }
      }
    }
  }

}
