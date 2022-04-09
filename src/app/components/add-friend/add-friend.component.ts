import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/_services/user.service';


@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.scss']
})
export class AddFriendComponent implements OnInit {
  error = '';
  success = '';
  isLoading = false;
  name = new FormControl('', [Validators.required]);
  constructor(
    private dialogRef: MatDialogRef<AddFriendComponent>,
    private user: UserService
  ) { }

  getError(form: FormControl) {
    if(form.hasError('required')){
      return 'Este campo é requirido.'
    }
    return '';
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
      this.user.addFriendByName(this.name.value).subscribe(r => {
        this.isLoading = false;
        this.name.reset();
        this.name.enable();
        this.dialogRef.disableClose = false;
        this.success = r.message;
      },e  => {
        this.error = e.error.message;
        this.isLoading = false;
        this.name.reset();
        this.name.enable();
        this.dialogRef.disableClose = false;
      })
    }
  }

}
