import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GuildService } from 'src/app/_services/guild.service';
import { MeService } from 'src/app/_services/me.service';
@Component({
  selector: 'app-new-guild',
  templateUrl: './new-guild.component.html',
  styleUrls: ['./new-guild.component.scss']
})
export class NewGuildComponent implements OnInit {
  name = new FormControl('', [Validators.required]);
  error = '';
  isLoading = false;
  constructor(
    private dialogRef: MatDialogRef<NewGuildComponent>,
    private guild: GuildService,
    private me: MeService
  ) {
    this.name.setValue(`Servidor de ${this.me.meSubject.value.username}`);
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('450px')
    this.dialogRef.addPanelClass('custom-dialog');
  }

  getError(form: FormControl){
    if(form.hasError('required')){
      return 'Este campo é requirido.'
    }
    return '';
  }

  save(){
    if(this.name.invalid){
      this.name.markAsDirty()
      this.name.markAllAsTouched();
    } else {
      this.isLoading = true;
      this.name.disable();
      this.dialogRef.disableClose = true;
      this.guild.create({ name: this.name.value }).subscribe(r => {
        this.dialogRef.close();
      }, e => {
        this.name.enable();
        this.isLoading = false;
        this.dialogRef.disableClose = false;
        this.error = e.error.message;
      })
    }
  }

 
}
