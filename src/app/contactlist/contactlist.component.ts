import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/userService/user.service';

@Component({
  selector: 'app-contactlist',
  templateUrl: './contactlist.component.html',
  styleUrls: ['./contactlist.component.css']
})
export class ContactlistComponent implements OnInit {

  public users: {[key: string]: string}[] = [];

  constructor(public router: Router, private userService: UserService) { 

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

}
