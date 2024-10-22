import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FakeHttpService,
  randStudent,
} from '../../data-access/fake-http.service';
import { StudentStore } from '../../data-access/student.store';
import { Student } from '../../model/student.model';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';

@Component({
  selector: 'app-student-card',
  template: `
    <ng-template #studentItemTmpl let-item>
      <app-list-item (deleteItem)="handleDeleteItem(item)">
        {{ item.firstName }}
      </app-list-item>
    </ng-template>
    <app-card
      class="bg-light-green"
      [list]="students()"
      [itemTemplate]="studentItemTmpl"
      (addNewItem)="handleAddItem()">
      <img src="assets/img/student.webp" width="200px" />
    </app-card>
  `,
  standalone: true,
  styles: [
    `
      :host {
        .bg-light-green {
          background-color: rgba(0, 250, 0, 0.1);
        }
      }
    `,
  ],
  imports: [CardComponent, ListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCardComponent implements OnInit {
  students = toSignal(this.store.students$);

  constructor(
    private http: FakeHttpService,
    private store: StudentStore,
  ) {}

  ngOnInit(): void {
    this.http.fetchStudents$.subscribe((s) => this.store.addAll(s));
  }
  handleDeleteItem(item: Student) {
    this.store.deleteOne(item.id);
  }

  handleAddItem() {
    this.store.addOne(randStudent());
  }
}
