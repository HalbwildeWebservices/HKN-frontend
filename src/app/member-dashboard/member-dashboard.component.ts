import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserIdTransferService } from '../services/userIdTransfer/user-id-transfer.service';

@Component({
  selector: 'app-member-dashboard',
  templateUrl: './member-dashboard.component.html',
  styleUrls: ['./member-dashboard.component.css']
})
export class MemberDashboardComponent implements OnInit {

  constructor(public router: Router, private userIdTransferService: UserIdTransferService) { }

  ngOnInit(): void {
  }

  createUser() {
    this.userIdTransferService.setUserId(undefined);
    this.router.navigate(['/users', 'new']);
  }

}
