import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DatabaseService{

  constructor(private http: Http) {
  }

  list(): Observable<Database[]>  {
    return this.http.get('http://0.0.0.0:9000/databases')
      .map(response => {
        console.log('response');
        console.log(response);
        return response.json() as Database[];
      });
  }

  programmabilitySP(server: string, database: string): Observable<SP[]>  {
    return this.http.get('http://0.0.0.0:9000/databases/' + server + '/' + database + '/sps')
      .map(response => {
        console.log('response');
        console.log(response);
        return response.json().map(s => new SP(s)) as SP[];
      });
  }
}

export class Database {
  server: string;
  database: string;
}

export class SP {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
