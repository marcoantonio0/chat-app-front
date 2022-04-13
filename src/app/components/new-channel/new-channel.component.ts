import { ChannelService } from './../../_services/channel.service';
import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/_services/user.service';
import { AddFriendComponent } from '../add-friend/add-friend.component';

@Component({
  selector: 'app-new-channel',
  templateUrl: './new-channel.component.html',
  styleUrls: ['./new-channel.component.scss']
})
export class NewChannelComponent implements OnInit {
    error = '';
    success = '';
    isLoading = false;
    guildId = '';
    type = 0;
    @ViewChild('focus', { static: true }) focus!: ElementRef<HTMLInputElement>
    name = new FormControl('', [Validators.required]);
    constructor(
      private dialogRef: MatDialogRef<NewChannelComponent>,
      private user: UserService,
      private channel: ChannelService,
      @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
      this.guildId = data.guildId;
      this.type = data.type;
    }
  
    getError(form: FormControl) {
      if(form.hasError('required')){
        return 'Este campo é requirido.'
      }
      return '';
    }

    keyEnter(e: KeyboardEvent){
      if(e.key == 'Enter'){
        this.send();
      }
    }
    
  
    ngOnInit(): void {
      this.dialogRef.updateSize('450px')
      this.dialogRef.addPanelClass('custom-dialog');
    }
  
    send(){
      if(this.name.invalid){
        this.name.markAsDirty()
        this.name.markAllAsTouched();
      } else {
        this.error = '';
        this.success = '';
        this.isLoading = true;
        this.name.disable();
        this.dialogRef.disableClose = true;
        let data: any = { type: this.type, name: this.name.value };
        if(this.data.parent_id.length > 0){
          data['parent_id'] = this.data.parent_id;
        }
        this.channel.create(this.guildId, data).subscribe(r => {
          this.isLoading = false;
          this.name.reset();
          this.name.enable();
          this.dialogRef.disableClose = false;
          this.success = r.message;
          this.focus.nativeElement.focus();
        },e  => {
          this.focus.nativeElement.focus();
          this.error = e.error.message;
          this.isLoading = false;
          this.name.reset();
          this.name.enable();
          this.dialogRef.disableClose = false;
        })
      }
    }

}
