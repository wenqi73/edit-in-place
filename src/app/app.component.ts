import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'edit-in-place';
  controls: FormArray;
  entities = [
    { id: 1, name: 'Netanel Basal', isAdmin: true },
    { id: 2, name: 'John Due', isAdmin: false },
  ]

  ngOnInit() {
    const groups = this.entities.map(item => {
      return new FormGroup({
        name: new FormControl(item.name),
        isAdmin: new FormControl(item.isAdmin)
      });
    });
    this.controls = new FormArray(groups);
  }

  getControl(row: number, name: string) {
    return this.controls.at(row).get(name);
  }

  updateField(row: number, name: string) {
    this.entities[row][name] = this.getControl(row, name).value;
  }
}
