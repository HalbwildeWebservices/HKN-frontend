import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EPermission } from 'hkn-common';
import { AuthServiceService } from '../services/authService/auth-service.service';
import { UserIdTransferService } from '../services/userIdTransfer/user-id-transfer.service';

@Component({
  selector: 'app-member-dashboard',
  templateUrl: './member-dashboard.component.html',
  styleUrls: ['./member-dashboard.component.css']
})
export class MemberDashboardComponent implements OnInit {

  public canActivateContactlist = false;
  public canAddUser = false;
  constructor(
    public router: Router, 
    private userIdTransferService: UserIdTransferService,
    private authService: AuthServiceService,
    
    ) { }

  ngOnInit(): void {
    this.setPermissions()
    
  }

  createUser() {
    this.userIdTransferService.setUserId(undefined);
    this.router.navigate(['/users', 'new']);
  }

  editProfile() {
    const userId = this.authService.getUserId();
    this.userIdTransferService.setUserId(userId);
    this.router.navigate(['/users', userId]);
  }

  private setPermissions() {
    const roles = this.authService.getRoles();
    this.canActivateContactlist = roles.some((r) => [EPermission.READ_USER.toString(), EPermission.UPDATE_USER.toString()].includes(r));
    this.canAddUser = roles.includes(EPermission.ADD_USER);
  }

}
