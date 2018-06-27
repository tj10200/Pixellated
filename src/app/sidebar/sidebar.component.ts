import { Component, OnInit, ViewChild } from '@angular/core';
import { SidebarService } from '../sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @ViewChild ('#fileinputsave') public fileinput: any;
  private fileinputplaceholder: string;
  constructor(private sidebar: SidebarService) { 
     this.fileinputplaceholder = "A \nBroken\nPlaceholder";
  }

  ngOnInit() {
  }

  public clearCanvas() {
    this.sidebar.clearCanvas();
  }

  public changeTool(tool:any) {
    this.sidebar.changeTool(tool);
  }

  private saveCanvases(filename:any) {
    this.sidebar.saveCanvases(filename.target.value);
  }

  private selectFile(event){
    console.log(event);

    var reader = new FileReader();
    reader.onload = () => {
        var filedata = JSON.parse(reader.result);
        this.sidebar.loadCanvasDataFromFile(filedata);
    };
    reader.readAsText(event.target.files[0]);
  }
}
