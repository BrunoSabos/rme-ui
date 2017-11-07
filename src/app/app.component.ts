import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import {Database, DatabaseService, Server, SP} from './database.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/collections';
import 'rxjs/add/operator/groupBy';
import {GroupedObservable} from 'rxjs/operators/groupBy';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/reduce';
import {groupBy} from 'rxjs/operator/groupBy';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DatabaseService]
})
export class AppComponent {
  query = `select T1.b, T2.c, T3.k
from T1
inner join T2
\ton T1.a = T2.a
inner join T3
\ton T3.e = T1.e
where T2.d = 'val'
\tand T2.c = T3.e`;
  title = 'rme';
  databaseFilterCtrl: FormControl;
  databaseAutocompleteCtrl: FormControl;
  filteredDatabases: Observable<Server[]>;
  // databaseService = this.databaseService;

  databases: Server[] = [];


  displayedColumns = [/*'selected', */'name'];
  // exampleDatabase = new ExampleDatabase();
  dataSource: ExampleDataSource | null;

  imageMessage: string = null;

  image: string = null;

  programmabilityLoading = false;

  // dataSource: SP[] = null;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild('imageContainer') dataContainer: ElementRef;
  @ViewChild('databaseFilter') databaseFilter: HTMLInputElement;


  constructor(private databaseService: DatabaseService) {
    // this.databaseService = _databaseService;
    this.databaseFilterCtrl = new FormControl();
    // this.databaseAutocompleteCtrl = new FormControl();

    this.filteredDatabases = this.databaseFilterCtrl.valueChanges
      .startWith(null)
      .map(state => state ? this.filterDatabases(state) : this.databases.slice());

    this.databaseService.databaseList().subscribe(data => {
      console.log('component');
      console.log(data);

      this.databases = data;

      this.databaseFilterCtrl.reset();
    });

    // this.databaseService.programmabilitySPList('LOGSQL02', 'VPN3').subscribe(data => {
    //   console.log('component');
    //   console.log(data);
    //
    //   this.dataSource = new ExampleDataSource(data);
    //
    //   this.databaseFilterCtrl.reset();
    // });
  }

  filterDatabases(name: string) {
    return this.databases.filter(databases =>
      databases.databases.filter(d => d.fullName.toLowerCase().indexOf(name.toLowerCase()) === 0).length > 0);
  }

  clearDatabase() {
    this.databaseFilterCtrl.reset();
  }

  chooseDB(database: Database) {
    this.programmabilityLoading = true;
    this.dataSource = null;
    this.databaseService.programmabilitySPList(database.server, database.name).subscribe(data => {
      this.dataSource = new ExampleDataSource(data);
      this.programmabilityLoading = false;
    });
  }

  showPS(ps: StoredProcedure) {
    // this.query = ps.content;
    this.databaseService.programmabilitySPGet(ps.server, ps.database, ps.name).subscribe(data => {
      this.query = data;

      this.getImage();
    });
  }

  ngOnInit() {
    //   this.dataSource = new ExampleDataSource(this.exampleDatabase);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  private getImage() {
    this.databaseService.image(this.query).subscribe(data => {
      console.log('image data');
      console.log(data);
      this.imageMessage = null;
      // this.image = this.sanitizer.bypassSecurityTrustHtml(data);
      this.dataContainer.nativeElement.innerHTML = data;
    }, error => {
      console.log('error data');
      console.log(error.text());
      this.imageMessage = error.text();
    });
  }

  // InputChanged(data: any) {
  //   console.log(data);
  // }
}

/** Constants used to fill up our data base. */
const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

export interface StoredProcedure {
  server: string;
  database: string;
  name: string;
  content: string;
}

export interface Database {
  server: string;
  fullName: string;
  name: string;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<UserData[]> = new BehaviorSubject<UserData[]>([]);

  get data(): UserData[] {
    return this.dataChange.value;
  }

  constructor() {
    // Fill up the database with 100 users.
    for (let i = 0; i < 100; i++) {
      this.addUser();
    }
  }

  /** Adds a new user to the database. */
  addUser() {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewUser());
    this.dataChange.next(copiedData);
  }

  /** Builds and returns a new User. */
  private createNewUser() {
    const name =
      NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    return {
      id: (this.data.length + 1).toString(),
      name: name,
      progress: Math.round(Math.random() * 100).toString(),
      color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
    };
  }
}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ExampleDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  // constructor(private _exampleDatabase: ExampleDatabase) {
  constructor(private _exampleDatabase: SP[]) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<SP[]> {
    const displayDataChanges = [
      // this._exampleDatabase.dataChange,
      this._filterChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      // return this._exampleDatabase.data.slice().filter((item: SP) => {
      return this._exampleDatabase.slice().filter((item: SP) => {
        // const searchStr = (item.name + item.color).toLowerCase();
        const searchStr = (item.name).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });
    });
  }

  disconnect() {
  }
}
