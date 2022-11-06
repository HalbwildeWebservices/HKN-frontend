import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/userService/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  nameFormGroup: FormGroup<{firstName: FormControl<string | null>, lastName: FormControl<string | null>}>;
  addressFormGroup: FormGroup<{
    street: FormControl<string | null>, 
    houseNumber: FormControl<string | null>
    zipCode: FormControl<string | null>
    town: FormControl<string | null>
    country: FormControl<string | null>
  }>;
  reachabilityFormGroup: FormGroup<{
    email: FormControl<string | null>, 
    phoneNumbers: FormArray<FormGroup<{
      number: FormControl<string | null>, 
      description: FormControl<string | null>}>>
  }>;
  userFormGroup: FormGroup<{username: FormControl<string | null>, password: FormControl<string | null>}>;
  privacyAndTermsGroup: FormGroup<{
    termsAccepted: FormControl<boolean | null>
    privacyAccepted: FormControl<boolean | null>
  }>;

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
    this.nameFormGroup = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
    this.addressFormGroup = this.formBuilder.group({
      street: ['', Validators.required],
      houseNumber: ['', Validators.required],
      zipCode: ['', Validators.required],
      town: ['', Validators.required],
      country: ['', Validators.required],
    });
    this.reachabilityFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phoneNumbers: this.formBuilder.array<FormGroup>([])
    });
    this.userFormGroup = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(30)]]
    });
    this.privacyAndTermsGroup = this.formBuilder.group({
      termsAccepted: [false, Validators.requiredTrue],
      privacyAccepted: [false, Validators.requiredTrue],
    });
  }

  ngOnInit() {
    
  }

  get phoneNumbers() {
    return this.reachabilityFormGroup.controls.phoneNumbers;
  }

  public addPhone() {
    const phoneForm = this.formBuilder.group({
      number: ['', [Validators.required, Validators.pattern(/^\+[\d]+$/)]],
      description: ['', [Validators.required]],
    });
    this.phoneNumbers.push(phoneForm);
  }

  public deletePhone(phoneIdx: number) {
    this.phoneNumbers.removeAt(phoneIdx);
  }

  public submit() {
    const user = {
      ...this.userFormGroup.value,
      ...this.nameFormGroup.value,
      address: {...this.addressFormGroup.value},
      ...this.reachabilityFormGroup.value,
    }
    console.log(user);
    this.userService.addUser(user)
      .subscribe({next: (res) => console.log(res), error: (err) => console.log(err)})
  }

}
