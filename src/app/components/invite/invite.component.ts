import { GuildService } from 'src/app/_services/guild.service';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {
  error = '';
  success = '';
  guildId = '';
  @ViewChild('focus', { static: true }) focus!: ElementRef<HTMLInputElement>;
  isLoading = true;

  link = new FormControl('', [Validators.required]);
  constructor(
    private dialogRef: MatDialogRef<InviteComponent>,
    private guild: GuildService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
     this.guildId = this.data.guildId;
     this.guild.createInvite(this.guildId, {}).subscribe(r =>{
       this.link.setValue(location.origin+'/invite/'+r.token)
       this.isLoading = false;
     })
  }


  ngOnInit(): void {
    this.dialogRef.updateSize('450px')
    this.dialogRef.addPanelClass('custom-dialog');
  }



}

