import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	playersList = [
		{
			id:1,
			name:'Player 1'
		},
		{
			id:2,
			name:'Player 2'
		},
		{
			id:3,
			name:'Player 3'
		},
		{
			id:4,
			name:'Player 4'
		},
		{
			id:5,
			name:'Player 5'
		},
		{
			id:6,
			name:'Player 6'
		},
		{
			id:7,
			name:'Player 7'
		},
		{
			id:8,
			name:'Player 8'
		},
		{
			id:9,
			name:'Player 9'
		},
		{
			id:10,
			name:'Player 10'
		},
		{
			id:11,
			name:'Player 11'
		}
	];
	user:any;
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
	  this.user = this.route.snapshot.queryParams['data'];
	  if(!this.user){
		  this.router.navigate(['/login']);
	  }
  }

}
