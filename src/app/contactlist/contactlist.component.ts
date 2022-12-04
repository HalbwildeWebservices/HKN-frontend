import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EPermission, IUserResponse } from 'hkn-common';
import { Subscription } from 'rxjs';
import { AuthServiceService } from '../services/authService/auth-service.service';
import { UserIdTransferService } from '../services/userIdTransfer/user-id-transfer.service';
import { UserService } from '../services/userService/user.service';
import { UserDetailComponent } from '../user-detail/user-detail.component';

@Component({
  selector: 'app-contactlist',
  templateUrl: './contactlist.component.html',
  styleUrls: ['./contactlist.component.css']
})
export class ContactlistComponent implements OnInit, OnDestroy {

  public users: IUserResponse[] = [];
  private subscriptions: Subscription[] = [];
  private roles: string[] = [];
  public canEditUsers = false;
  public canDeleteUsers = false;
  public canManagePermissions = false;
  public isLoading = false;


  constructor(
    public router: Router, 
    private userService: UserService, 
    private dialog: MatDialog,
    private userIdTransferService: UserIdTransferService,
    private authService: AuthServiceService,
  ) { }


  ngOnInit(): void {
    this.isLoading = true;
    this.getUsers();
    this.roles = this.authService.getRoles();
    console.log(this.roles)
    this.canEditUsers = this.roles.includes('update_user')//EPermission.UPDATE_USER);
    this.canDeleteUsers = this.roles.includes('delete_user')// EPermission.DELETE_USER);
    this.canManagePermissions = this.roles.includes('manage_permission')// EPermission.MANAGE_PERMISSION);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }


  public getUsers() {
    this.subscriptions.push(
      this.userService.getUsers().subscribe(
        {
          next: (res) => {
            console.log(res);
            this.users = res;
            this.isLoading = false;
          },
          error: (err) => {
            alert(err?.message ?? 'loading users failed');
            this.router.navigate(['dashboard']);
          }
    })
    );
  }

  public showDetail(selectionIndex: number) {
    this.dialog.open(UserDetailComponent, {
      data: { users: this.users, selectionIndex },
    })
  }

  public editUser(userId: string) {
    this.userIdTransferService.setUserId(userId);
    this.router.navigate(['/users', userId]);
  }

  public deleteUser(userId: string) {
    this.subscriptions.push(
      this.userService.deleteUser(userId).subscribe({
        next: (value) => this.users = value,
        error: (err) => alert(JSON.stringify(err)),
      })
    );
  }

  public editPermissions(userId: string) {
    this.userIdTransferService.setUserId(userId);
    this.router.navigate(['/users', userId, 'permissions']);
  }
}
