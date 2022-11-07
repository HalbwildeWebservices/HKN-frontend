import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IUser } from 'hkn-common';
import { UserService } from '../services/userService/user.service';
import { UserDetailComponent } from '../user-detail/user-detail.component';

@Component({
  selector: 'app-contactlist',
  templateUrl: './contactlist.component.html',
  styleUrls: ['./contactlist.component.css']
})
export class ContactlistComponent implements OnInit {

  public users: IUser[] = [];

  constructor(public router: Router, private userService: UserService, private dialog: MatDialog) { 

  }


  ngOnInit(): void {
    this.getUsers()
  }

  public getUsers() {
    return this.userService.getUsers().subscribe((res) => {
      console.log(res);
      this.users = res;
    });
  }

  public showDetail(selectionIndex: number) {
    this.dialog.open(UserDetailComponent, {
      data: { users: this.users, selectionIndex},
    })
  }

}
