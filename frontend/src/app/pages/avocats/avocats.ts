import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-avocats',
  imports: [CommonModule, RouterLink],
  templateUrl: './avocats.html',
  styleUrl: './avocats.css',
})
export class Avocats {

}
