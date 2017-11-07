import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DatabaseService {

  constructor(private http: Http) {
  }

  databaseList(): Observable<Server[]> {
    return this.http.get('http://0.0.0.0:9000/servers')
      .map(response => {
        console.log('response');
        console.log(response);
        const databases = response.json() as Server[];
        return databases;
        // return databases.map(d => {d.fullName = d.server + ' / ' + d.database; return d});
      });
  }

  programmabilitySPList(server: string, database: string): Observable<SP[]> {
    return this.http.get('http://0.0.0.0:9000/databases/' + server + '/' + database + '/sps')
      .map(response => {
        console.log('response');
        console.log(response);
        const json = response.json();
        // return Object.keys(json).map(s => new SP(s, json[s])) as SP[];
        return json.map(s => new SP(server, database, s['filename'], '')) as SP[];
      });
  }

  programmabilitySPGet(server: string, database: string, query: string): Observable<string> {
    return this.http.get('http://0.0.0.0:9000/databases/' + server + '/' + database + '/sps/' + query)
      .map(response => {
        console.log('response');
        console.log(response);
        return response.text();
      });
  }

  image(query: string): Observable<string> {
    return this.http.post('http://0.0.0.0:9000/image', {sql: query})
      .map(response => {
        console.log('response');
        console.log(response);
        return response.text();
      });
  }
}

export class Server {
  name: string;
  databases: Database[];

  constructor(name: string, databases: Database[]) {
    this.name = name;
    this.databases = databases;
  }
}

export class Database {
  server: string;
  name: string;
  fullName: string;
}

export class SP {
  server: string;
  database: string;
  name: string;
  content: string;

  constructor(server: string, database: string, name: string, content: string) {
    this.server = server;
    this.database = database;
    this.name = name;
    this.content = content;
  }
}
