import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EPermission, IPermissionResponse, IUserResponse } from 'hkn-common';
import { Subscription } from 'rxjs';
import { UserIdTransferService } from '../services/userIdTransfer/user-id-transfer.service';
import { UserService } from '../services/userService/user.service';

@Component({
  selector: 'app-permission-editor',
  templateUrl: './permission-editor.component.html',
  styleUrls: ['./permission-editor.component.css']
})
export class PermissionEditorComponent implements OnInit, OnDestroy {

  public availablePermissions: {selected: boolean, name: string}[] = [];
  public actualPermissions: {selected: boolean, name: string}[] = [];
  private userId: string | undefined = undefined;
  public isLoading: boolean = false;
  private subscriptions: Subscription[] = []

  constructor(
      private userIdTransferService: UserIdTransferService,
      private userService: UserService,
      private router: Router,
    ) { }

  ngOnInit(): void {
    this.isLoading = true;
    const userIdSubscription = this.userIdTransferService.userId
      .subscribe((userId) => {
        if (!userId) {
          this.router.navigate(['users'])
          return;
        }
        this.userId = userId;
        const permissionSubscription = this.userService.getUserPermissions(userId)
          .subscribe((permissions) => {
            this.populatePermissions(permissions);
            this.isLoading = false;
          });
        this.subscriptions.push(permissionSubscription);
    });
    this.subscriptions.push(userIdSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subs) => {
      subs.unsubscribe();
      this.userIdTransferService.setUserId(undefined);
    });
  }

  private populatePermissions(permissionsResponse: IPermissionResponse) {
    const actualPermissionNames = permissionsResponse.permissions.map((p) => p.name);
    this.actualPermissions = actualPermissionNames.map((n) => {return {selected: false, name: n}});
    this.availablePermissions = Object.values(EPermission)
      .filter(v => !actualPermissionNames.includes(v))
      .map((v) => {return {selected: false, name: v}})
  }

  public putPermissions() {
    if (!this.userId) {
      this.router.navigate(['users']);
      return;
    }
    const putSubscription = this.userService
      .setUserPermissions(this.userId, this.actualPermissions.map((p) => p.name))
      .subscribe({
        next: (user) => {
          alert(`Permissions for user ${user.username} successfully updated`);
          this.router.navigate(['users']);
        },
        error: (err) => {
          alert(`Error updating permissions ${err?.error?.message}`);
          this.router.navigate(['users']);
        }  
      });
    this.subscriptions.push(putSubscription);
  }

  public cancel() {
    this.router.navigate(['users']);
  }

  public addPermissions() {
    const selectedPermissions = this.availablePermissions.filter((p) => p.selected);
    this.actualPermissions.push(...selectedPermissions);
    this.availablePermissions = this.availablePermissions.filter((p) => !p.selected);
    this.actualPermissions.forEach((p) => p.selected = false);
    this.availablePermissions.forEach((p) => p.selected = false);
  }

  public removePermissions() {
    const selectedPermissions = this.actualPermissions.filter((p) => p.selected);
    this.availablePermissions.push(...selectedPermissions);
    this.actualPermissions = this.actualPermissions.filter((p) => !p.selected);
    this.actualPermissions.forEach((p) => p.selected = false);
    this.availablePermissions.forEach((p) => p.selected = false);
  }

  public addDisabled() {
    return this.availablePermissions.every((p) => !p.selected);
  }

  public removeDisabled() {
    return this.actualPermissions.every((p) => !p.selected)
  }

}
