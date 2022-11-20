import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ContactHKNComponent } from './contact-hkn/contact-hkn.component';
import { MemberDashboardComponent } from './member-dashboard/member-dashboard.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { ContactlistComponent } from './contactlist/contactlist.component';
import { MemberProfileComponent } from './member-profile/member-profile.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { PermissionEditorComponent } from './permission-editor/permission-editor.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
  },
  {
    path: 'contact-hkn',
    component: ContactHKNComponent,
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'dashboard',
    component: MemberDashboardComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'users',
    component: ContactlistComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'users/:userId',
    component: CreateUserComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'profile',
    component: MemberProfileComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'users/new',
    component: CreateUserComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'users/:userId/permissions',
    component: PermissionEditorComponent,
    canActivate: [AuthGuardService],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
