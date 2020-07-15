import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found-page',
  template: `
    <div class="container">
      <div class="text-center"> <h1> Página não encontrada </h1> </div>
    </div>
  `,
  styles: [
  ]
})
export class NotFoundPageComponent implements OnInit {

  constructor(
    private title: Title
  ) { }

  ngOnInit(): void {

    this.title.setTitle('Página não encontrada');
  }

}
