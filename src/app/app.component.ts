import { SocketService } from './_services/socket.service';
import { Component, HostListener } from '@angular/core';
import { ElectronService } from './_services/electron.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  maximized = false;
  status: string = '';
  constructor(
    private socket: SocketService,
    public electron: ElectronService
  ) {
    if(electron.isElectron()){
      this.electron.ipcRenderer.on('minOrmax', (event, data) => {
        if (data == 'maximize') {
          this.maximized = true;
        } else if(data == 'unmaximize') {
          this.maximized = false;
        }
      })
    }

    this.socket.statusSocket.subscribe(status => {
      this.status = status;
    })
  }
  title = 'chat-app-front';

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: PointerEvent) {
    event.preventDefault();
  }
  
  min() {
    this.electron.ipcRenderer.invoke('min');
  }

  maxOrUnmax() {
    this.electron.ipcRenderer.invoke('maxOrUnmax');
  }


  close() {
    this.electron.ipcRenderer.invoke('close');
  }

}
