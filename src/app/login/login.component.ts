import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {Router} from "@angular/router"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  regForm: FormGroup;
  isSubmitted:boolean = false;
  
  constructor(private formBuilder:FormBuilder, private router: Router) { }

  ngOnInit(): void {
	  this.regForm = this.formBuilder.group({
		  name:['',Validators.required],
		  password:['',Validators.required]
	  });
  }
   
  get formControls(){
	  return this.regForm.controls;
  }
  
  submitForm(event, data){	  
	  event.preventDefault();
	  this.isSubmitted = true;
	  if(this.regForm.invalid){
		  return;
	  }
	  this.router.navigate(['/dashboard']);
  }
}
