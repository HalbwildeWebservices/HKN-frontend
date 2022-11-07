import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { IUser } from 'hkn-common';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  private selectionIndex: number;
  public user: IUser

  constructor(@Inject(MAT_DIALOG_DATA) public data: {users: IUser[], selectionIndex: number}) { 
    this.selectionIndex = data.selectionIndex;
    this.user = data.users[this.selectionIndex];
  }

  ngOnInit(): void {
  }

  nextUser() {
    this.selectionIndex = Math.min(this.data.users.length -1, this.selectionIndex + 1);
    this.user = this.data.users[this.selectionIndex];
  }

  previousUser() {
    this.selectionIndex = Math.max(0, this.selectionIndex - 1);
    this.user = this.data.users[this.selectionIndex];
  }



}
