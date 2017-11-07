import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// https://material.angular.io/guide/getting-started#step-2-animations
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// https://material.angular.io/guide/getting-started#step-3-import-the-component-modules
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatIconModule, MatProgressSpinnerModule, MatRippleModule, MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {MatFormFieldModule, MatAutocompleteModule, MatOptionModule, MatInputModule} from '@angular/material';

import {HttpModule} from '@angular/http';

import {AceEditorModule} from 'ng2-ace-editor';
import {SqleditorComponent} from './sqleditor.component';
import {ReplacelinebreaksPipe} from './replacelinebreaks.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SqleditorComponent,
    ReplacelinebreaksPipe
  ],
  imports: [
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatInputModule,
    MatRippleModule,
    MatTableModule,
    MatCardModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AceEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
