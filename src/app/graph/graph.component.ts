import { Component, Input, OnInit, OnChanges, ViewChild, AfterViewChecked, HostListener, Output, EventEmitter } from '@angular/core';
import { DataPoint, GraphSeries } from '../graphdata';
import { PheService } from '../phe.service';
import { PlaceName } from '../place';
import { Structure } from '../structure';
import { FIELDS } from '../field_desc';
import * as _ from 'lodash-es';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { LineChartComponent } from '@swimlane/ngx-charts';
import { MatSliderChange } from '@angular/material/slider';

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

  @ViewChild('chart') chart: LineChartComponent;
  @Input() placeName: PlaceName;
  @Input() areaType: string;
  fields: Array<string>;
  selectedOption = '';
  multi: GraphSeries[] = [];
  data;
  view: any[] = [700, 300];
  filter: string;
  areaName: string;
  yScaleMax: number;
  fieldDescription = FIELDS;
  graphData;
  ageData: GraphSeries[];
  showGraph = true;
  maxY = 0;
  sliderValue;
  showFields;
  databaseQueried = false;


  constructor(private PHE: PheService) { }



  ngOnInit(): void {
   
  }

  ngOnChanges(): void {

     const s = new Structure();
    this.fields = Describer.describe(s).slice(5);
    this.fields.splice(5, 0, 'allCases');
  
    this.PHE.getData(this.filter).subscribe(data => {
      this.data = data;
      console.log(data.filter);
      this.maxY = this.getMaxY();
      
    });

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
        this.maxY = this.getMaxY();
        this.sliderValue = this.maxY;
      });
    }


  }
  onUpdate(): void {


    switch (this.selectedOption[0]) {
      case 'maleCases':
        this.getAgeData('maleCases');
        this.getDailyRate();
        break;

      case 'femaleCases':
        this.getAgeData('femaleCases');
        this.getDailyRate();
        break;

      case 'cumAdmissionsByAge':
        this.getAgeData('cumAdmissionsByAge');
        this.getDailyRate();
        break;

      case 'allCases':
        this.getAllAgeData();
        break;
        
      default:
        this.getGraphData();
        break;
        
    }

  this.databaseQueried = true;









  }
  getAllAgeData() {
    
    let maleMulti: GraphSeries[] = [];
    this.getAgeData('maleCases');
    this.getDailyRate();
    this.multi.forEach(gS => {
      maleMulti.push(gS);
    });
    this.getAgeData('femaleCases');
    this.getDailyRate();
    this.multi.forEach((gS, i) => {
      gS.series.forEach((data, j) => {
        data.value = data.value + maleMulti[i].series[j].value;
      });
    });
    this.sliderValue = this.getMaxY();
    this.maxY = this.sliderValue;
  }
  test(): void {
    // this.showGraph = !this.showGraph;
    console.log('x');
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
    this.sliderValue = this.getMaxY();
    this.maxY = this.sliderValue;

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

    this.sliderValue = this.getMaxY();
    this.maxY = this.sliderValue;

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
    this.sliderValue = this.getMaxY();
    this.maxY = this.sliderValue;

  }

  private select(e) {
    console.log(e);
  }
  private getMaxY() {
    let maxY = 0;
    if (this.multi) {
      this.multi.forEach(data => {
        data.series.forEach(point => {

          if (point.value > maxY) { maxY = point.value; }

        });
      });
    }

    return maxY;
  }
  onValueChange(e: MatSliderChange) {
    console.log(e.value);
    this.chart.yScaleMax = e.value;
    this.chart.timelineHeight = 50 * (this.chart.getYDomain()[1] / this.maxY);
    this.chart.update();


  }
  display(){
    if(this.multi) {
      if(this.multi.length > 0){
        return 2;
      }
      else{
        return 1;
      }
    }
    else {
      return 0;
    }
  }

}
