import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IUser } from 'hkn-common';
import { Subscription } from 'rxjs';
import { UserService } from '../services/userService/user.service';
import { UserDetailComponent } from '../user-detail/user-detail.component';

@Component({
  selector: 'app-contactlist',
  templateUrl: './contactlist.component.html',
  styleUrls: ['./contactlist.component.css']
})
export class ContactlistComponent implements OnInit, OnDestroy {

  public users: IUser[] = [];
  private subscriptions: Subscription[] = [];

  constructor(public router: Router, private userService: UserService, private dialog: MatDialog) {

  }


  ngOnInit(): void {
    this.getUsers()
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }


  public getUsers() {
    this.subscriptions.push(
      this.userService.getUsers().subscribe((res) => {
        console.log(res);
        this.users = res;
      })
    );
  }

  public showDetail(selectionIndex: number) {
    this.dialog.open(UserDetailComponent, {
      data: { users: this.users, selectionIndex },
    })
  }

  public deleteUser(userId: string) {
    this.subscriptions.push(
      this.userService.deleteUser(userId).subscribe({
        next: (value) => this.users = value,
        error: (err) => alert(JSON.stringify(err)),
      })
    );
  }

}
