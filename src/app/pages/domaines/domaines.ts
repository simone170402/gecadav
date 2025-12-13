import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-domaines',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './domaines.html',
  styleUrl: './domaines.css',
})
export class Domaines {

}
