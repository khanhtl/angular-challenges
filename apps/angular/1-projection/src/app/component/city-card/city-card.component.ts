import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CityStore } from '../../data-access/city.store';
import {
  FakeHttpService,
  randomCity,
} from '../../data-access/fake-http.service';
import { City } from '../../model/city.model';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';

@Component({
  selector: 'app-city-card',
  template: `
    <ng-template #cityItemTmpl let-item>
      <app-list-item (deleteItem)="handleDeleteItem(item)">
        {{ item.name }}
      </app-list-item>
    </ng-template>
    <app-card
      class="bg-light-yellow"
      [list]="cities()"
      [itemTemplate]="cityItemTmpl"
      (addNewItem)="handleAddItem()">
      <img src="assets/img/city.png" width="200px" />
    </app-card>
  `,
  standalone: true,
  styles: [
    `
      :host {
        .bg-light-yellow {
          background-color: rgba(255, 250, 0, 0.1);
        }
      }
    `,
  ],
  imports: [CardComponent, ListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityCardComponent implements OnInit {
  cities = toSignal(this.store.cities$);

  constructor(
    private http: FakeHttpService,
    private store: CityStore,
  ) {}

  ngOnInit(): void {
    this.http.fetchCities$.subscribe((s) => this.store.addAll(s));
  }

  handleDeleteItem(item: City) {
    this.store.deleteOne(item.id);
  }

  handleAddItem() {
    this.store.addOne(randomCity());
  }
}
