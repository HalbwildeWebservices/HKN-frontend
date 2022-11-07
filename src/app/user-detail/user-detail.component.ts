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

  constructor(@Inject(MAT_DIALOG_DATA) public data: {user: IUser}, private formBuilder: FormBuilder) { 
    
  }

  ngOnInit(): void {
  }

}
