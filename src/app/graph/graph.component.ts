import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { DataPoint, GraphSeries } from '../graphdata';
import { PheService } from '../phe.service';
import { PlaceName } from '../place';
import { Structure } from '../structure';
import { FIELDS } from '../field_desc';
import * as _ from 'lodash-es';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';

class Describer {
  static describe(instance): Array<string> {
    return Object.getOwnPropertyNames(instance);
  }
}

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, OnChanges {

  @Input() placeName: PlaceName;
  @Input() areaType: string;
  fields: Array<string>;
  selectedOption = '';
  multi: GraphSeries[];
  data;
  view: any[] = [700, 300];
  filter: string;
  areaName: string;
  yScaleMax: number;
  fieldDescription = FIELDS;
  graphData;
  ageData: GraphSeries[];
  showGraph = true;
  constructor(private PHE: PheService) { }

  ngOnInit(): void {
    const s = new Structure();
    this.fields = Describer.describe(s).slice(5);
    this.PHE.getData(this.filter).subscribe(data => {
      this.data = data;
      console.log(data.filter);
    });
  }

  ngOnChanges(): void {

    if (this.placeName) {
      switch (this.areaType) {

        case 'UTLA':
          this.filter = 'filters=areaType=utla;areaCode=' + this.placeName.UTLA;
          this.areaName = this.placeName.UTLA_areaName;
          break;

        case 'LTLA':
          this.filter = 'filters=areaType=ltla;areaCode=' + this.placeName.LTLA;
          this.areaName = this.placeName.LTLA_areaName;
          break;

        case 'region':
          this.filter = 'filters=areaType=region;areaCode=' + this.placeName.region;
          this.areaName = this.placeName.region_areaName;
          break;
        case 'nation':
          this.filter = 'filters=areaType=nation;areaName=england';
          this.areaName = 'England';
          break;

        default:
          break;
      }

      this.PHE.getData(this.filter).subscribe(data => {
        this.data = data;
        console.log(data.filter);
      });
    }


  }
  onUpdate(): void {


    switch (this.selectedOption[0]) {
      case 'maleCases':
        this.getAgeData('maleCases');
        break;

      case 'femaleCases':
        this.getAgeData('femaleCases');
        break;

      case 'cumAdmissionsByAge':
        this.getAgeData('cumAdmissionsByAge');
        this.getDailyRate();
        break;
      default:
        this.getGraphData();
        break;
    }











  }
  test(): void {
    this.showGraph = !this.showGraph;
  }
  getGraphData(): void {
    // this.seriesData.series = this.data.data;
    // this.results.push(this.seriesData);
    // this.graphData = [];
    // this.fields.forEach(field => {
    //   const thisSeries = new GraphSeries();
    //   thisSeries.name = field;
    //   this.data.data.forEach(series => {

    //     const point = new DataPoint();
    //     point.value = (series[field] == null) ? '' : series[field];
    //     point.name = new Date(series.date);
    //     thisSeries.series.push(point);

    //   });
    //   this.graphData.push(thisSeries);

    // });
    if (!this.data) {
      console.log('No data');
      return;
    }

    this.multi = [];

    console.log('Start time: ' + Date());
    const thisSeries = new GraphSeries();
    thisSeries.name = this.selectedOption[0];
    this.data.data.forEach(series => {

      const point = new DataPoint();
      point.value = (series[this.selectedOption[0]] == null) ? '' : series[this.selectedOption[0]];
      point.name = new Date(series.date);
      thisSeries.series.push(point);


      this.multi.push(thisSeries);

    });
    console.log('End time: ' + Date());

  }
  private getAgeData(cases: string): void {
    if (!this.data) { return; }
    const rawData = [];
    const ranges: string[] = [];
    this.data.data.forEach(element => {
      const o = { date: Date, data: {} };
      o.date = element.date;
      o.data = element[cases];
      rawData.push(o);
    });
    rawData.forEach(o => {
      if (o.data) {
        o.data.forEach(dp => {
          if (!ranges.includes(dp.age)) {
            ranges.push(dp.age);
          }
        });
      }

    });
    this.multi = [];
    ranges.forEach(field => {
      const thisSeries = new GraphSeries();
      thisSeries.name = field;
      rawData.forEach(series => {
        if (series.data) {
          const point = new DataPoint();
          series.data.forEach(p => {
            if (p.age === field) {
              point.value = (p.value == null) ? '' : p.value;
              point.name = new Date(series.date);
              thisSeries.series.push(point);
            }
          });
        }



      });
      this.multi.push(thisSeries);
      this.multi.sort((a, b) =>
        (Number(a.name.split(/(\D)/)[0].toString()) > Number(b.name.split(/(\D)/)[0].toString())) ? 1 :
          ((Number(b.name.split(/(\D)/)[0].toString()) > Number(a.name.split(/(\D)/)[0].toString())) ? -1 : 0));
    });

  }

  private getDailyRate(): void {

    this.multi.forEach(graphData => {
      const graphSeries = _.cloneDeep(graphData.series);
      const orig: DataPoint[] = [];
      // graphData.series.forEach(element => {
      //   const dataPoint = new DataPoint();
      //   dataPoint.name = element.name;
      //   dataPoint.value = element.value;
      //   orig.push(dataPoint);
      // });
      graphSeries.forEach((v, i) => {
        if (i > 0) {
          graphData.series[i].value = graphSeries[i - 1].value - graphSeries[i].value;
        }

      });
      graphData.series[0].value = 0;
    });


  }

}
