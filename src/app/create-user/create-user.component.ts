import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ICreatePhoneNumberRequest, ICreateUserRequest, IPatchPhoneNumberRequest, IPatchUserRequest, IPhoneNumber, IUser, IUserResponse } from 'hkn-common';
import { UserService } from '../services/userService/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, map, debounceTime, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit, OnDestroy {
  public isLoading: boolean = false;
  private $userId: Subject<string> = new Subject();
  private $user: Subject<IUserResponse> = new Subject();
  public editMode: boolean = false;
  public storedUser: IUserResponse | undefined = undefined;
  private deletedPhoneIds: Set<string> = new Set([]);
  private updatedPhoneIds: Set<string> = new Set([]);

  nameFormGroup: FormGroup<{firstName: FormControl<string>, lastName: FormControl<string>}>;
  addressFormGroup: FormGroup<{
    street: FormControl<string>, 
    houseNumber: FormControl<string>
    zipCode: FormControl<string>
    town: FormControl<string>
    country: FormControl<string>
  }>;
  reachabilityFormGroup: FormGroup<{
    email: FormControl<string>, 
    phoneNumbers: FormArray<FormGroup<{
      number: FormControl<string>, 
      description: FormControl<string>
      phoneId: FormControl<string>
    }>>
  }>;
  credentialsFormGroup: FormGroup<{username: FormControl<string>, password: FormControl<string>}>;
  privacyAndTermsGroup: FormGroup<{
    termsAccepted: FormControl<boolean>
    privacyAccepted: FormControl<boolean>
  }>;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.nameFormGroup = this.formBuilder.nonNullable.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
    this.addressFormGroup = this.formBuilder.nonNullable.group({
      street: ['', [Validators.required]],
      houseNumber: ['', Validators.required],
      zipCode: ['', Validators.required],
      town: ['', Validators.required],
      country: ['', Validators.required],
    });
    this.reachabilityFormGroup = this.formBuilder.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      phoneNumbers: this.formBuilder.array<FormGroup>([])
    });
    this.credentialsFormGroup = this.formBuilder.nonNullable.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(30)]]
    });
    this.privacyAndTermsGroup = this.formBuilder.nonNullable.group({
      termsAccepted: [false, Validators.requiredTrue],
      privacyAccepted: [false, Validators.requiredTrue],
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.$user.subscribe((u) => {
      this.isLoading = false;
      this.storedUser = u;
      this.fillForm(u);
    })
    this.$userId.subscribe((id) => {
        this.userService.getUser(id).subscribe((u) => this.$user.next(u));
    })
    this.activatedRoute.params.pipe(
      map((p) => p['userId'])
    ).subscribe((id) => {
      if (typeof id === 'string' && id !== 'new') {
        this.$userId.next(id)
        this.editMode = true;
      } else {
        this.isLoading = false;
      }
    });
  }

  get phoneNumbers() {
    return this.reachabilityFormGroup.controls.phoneNumbers;
  }

  public addPhone() {
    const phoneForm = this.phoneNumberGroup()
    this.phoneNumbers.push(phoneForm);
    this.reachabilityFormGroup.updateValueAndValidity();
  }

  private phoneNumberGroup(_number = "", _description = "", _phoneId = "") {
    return this.formBuilder.nonNullable.group({
      number: [_number, [Validators.required, Validators.pattern(/^\+[\d]+$/)]],
      description: [_description, [Validators.required]],
      phoneId: [_phoneId, []]
    });
  }

  public deletePhone(phoneIdx: number) {
    const phoneId = this.phoneNumbers.at(phoneIdx).getRawValue().phoneId;
    if (phoneId !== '') {
      this.deletedPhoneIds.add(phoneId);
      this.updatedPhoneIds.delete(phoneId);
    }
    this.phoneNumbers.removeAt(phoneIdx);
    
  }

  public submit() {
    const userFromForm: ICreateUserRequest = {
      ...this.credentialsFormGroup.getRawValue(),
      ...this.nameFormGroup.getRawValue(),
      address: {...this.addressFormGroup.getRawValue()},
      email: this.reachabilityFormGroup.controls.email.getRawValue(),
      phoneNumbers: this.reachabilityFormGroup.controls.phoneNumbers
        .getRawValue()
        .map((p) => {return {number: p.number, description: p.description}}),
    }
    console.log('new user', userFromForm)
    if (!this.editMode) {
      this.userService.addUser(userFromForm)
      .subscribe({next: (res) => {
        alert(`user ${res.username} successfully created`);
        this.router.navigate(['/dashboard'])
      }, error: (err) => alert(err.error?.message ?? 'error - User may not have been created. Inform webmaster. Check contact list')})
    } else if (this.editMode && typeof this.storedUser?.userId === 'string') {
      const patchUserRequest: IPatchUserRequest = {
        firstName: userFromForm.firstName,
        lastName: userFromForm.lastName,
        email: userFromForm.email,
        address: userFromForm.address,
      }
      const updateUserPromises: Promise<any>[] = []
      updateUserPromises.push(firstValueFrom(this.userService.updateUser(this.storedUser.userId, patchUserRequest)))
    
      const phoneNumbers = this.reachabilityFormGroup.controls.phoneNumbers.getRawValue();
      const patchPhoneRequests: IPatchPhoneNumberRequest[] = []
      const newPhoneRequest: ICreatePhoneNumberRequest[] = [];
      for (const phoneNumber of phoneNumbers) {
        if (phoneNumber.phoneId === '') {
          newPhoneRequest.push({number: phoneNumber.number, description: phoneNumber.description})
        } else if (this.updatedPhoneIds.has(phoneNumber.phoneId)) {
          patchPhoneRequests.push(phoneNumber);
        }
      } 
      for (const request of newPhoneRequest) {
        updateUserPromises.push(firstValueFrom(this.userService.addPhoneNumber(this.storedUser.userId, request)));
      } 
      for (const request of patchPhoneRequests) {
        updateUserPromises.push(firstValueFrom(this.userService.updatePhoneNumber(this.storedUser.userId, request)));
      } 
      for (const phoneId of this.deletedPhoneIds) {
        updateUserPromises.push(firstValueFrom(this.userService.deletePhoneNumber(this.storedUser.userId, phoneId)));
      }  
      Promise.all(updateUserPromises)
        .then(() => this.router.navigate(['/dashboard']))
        .catch((err) => alert(err.error.message)) 
    }
    
  }

  private fillForm(user: IUserResponse) {
    if (user.address) {
      this.addressFormGroup.patchValue(user.address);
      this.addressFormGroup.updateValueAndValidity();
    }
    this.nameFormGroup.patchValue({firstName: user.firstName, lastName: user.lastName})
    this.nameFormGroup.updateValueAndValidity();
    this.reachabilityFormGroup.patchValue({email: user.email});
    for (const phoneNumber of user.phoneNumbers ?? []) {
      const phoneForm = this.phoneNumberGroup(phoneNumber.number, phoneNumber.description, phoneNumber.phoneId);
      phoneForm.valueChanges.pipe(debounceTime(500)).subscribe((res) => {
        if (res.phoneId) {
          this.updatedPhoneIds.add(res.phoneId ?? 'unknown');
        }
      });
      this.reachabilityFormGroup.controls.phoneNumbers.push(phoneForm);
    }
    this.reachabilityFormGroup.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.$user.unsubscribe();
    this.$userId.unsubscribe();
  }

}
