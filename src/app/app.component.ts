import { Component, OnInit } from '@angular/core';

import { PheService } from './phe.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MultilpleGraphSeries, GraphSeries, DataPoint } from './graphdata';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MSOA } from './msoa';
import { PlaceName } from './place';
import { LOOKUP } from './lookup_table';
import { Structure } from './structure';

class Describer {
  static describe(instance): Array<string> {
    return Object.getOwnPropertyNames(instance);
  }
}



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  msoaControl = new FormControl();
  msoaNames: string[] = ['Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue'];
  filteredStreets: Observable<string[]>;
  data;
  title = 'covid';
  series = [];
  view: any[] = [700, 300];
  seriesData = { name: 'Cases', series: [] };
  results: any[] = [];
  multi: GraphSeries[];
  msoa = MSOA;
  places: PlaceName[] = LOOKUP;
  msoaName = 'xxx';
  selectedPlace: PlaceName;
  fields: Array<string>;
  fieldControl = new FormControl();
  selectedFields: string[];
  selectedOptions: string[] = [];



  constructor(private PHE: PheService) {
    // Object.assign(this, { this : this.data.data });
  }

  ngOnInit(): void {
    // this.PHE.getData().subscribe(data => {
    //   this.data = data;
    //   console.log(data.filter);
    //   // this.seriesData.series = this.data.data;
    //   // this.results.push(this.seriesData);
    //   this.multi = [];
    //   const thisSeries = new GraphSeries();
    //   thisSeries.name = 'xxxx';
    //   this.data.data.forEach(series => {

    //     const point = new DataPoint();
    //     point.value = (series.newCasesBySpecimenDate == null) ? '' : series.newCasesBySpecimenDate;
    //     point.name = new Date(series.date);
    //     thisSeries.series.push(point);

    //   });
    //   this.multi.push(thisSeries);

    // });
    this.filteredStreets = this.msoaControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.msoaNames = [];
    this.places.forEach(m => this.msoaNames.push(m.MSOA_areaName));

    const s = new Structure();
    this.fields = Describer.describe(s).slice(5);
    console.log(this.fields);

  }

  onClick(): void {
    this.multi = [];
    this.selectedOptions.forEach(field => {
      const thisSeries = new GraphSeries();
      thisSeries.name = field;
      this.data.data.forEach(series => {

        const point = new DataPoint();
        point.value = (series[field] == null) ? '' : series[field];
        point.name = new Date(series.date);
        thisSeries.series.push(point);

      });
      this.multi.push(thisSeries);
    });



    
  }
  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    if (value.length < 3) { return []; }
    return this.msoaNames.filter(street => this._normalizeValue(street).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  msoaEntered(x): void {
    this.selectedPlace = { ...this.places.find(place => place.MSOA_areaName === x) };
    console.log(this.selectedPlace.MSOA_areaName);
  }

}
