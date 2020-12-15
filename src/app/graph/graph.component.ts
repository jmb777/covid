import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { DataPoint, GraphSeries } from '../graphdata';
import { PheService } from '../phe.service';
import { PlaceName } from '../place';
import { Structure } from '../structure';
import { FIELDS } from '../field_desc';

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
  selectedOptions: string[] = [];
  multi: GraphSeries[];
  data;
  view: any[] = [700, 300];
  filter: string;
  areaName: string;
  yScaleMax: number;
  fieldDescription = FIELDS;
  graphData;
  constructor(private PHE: PheService) { }

  ngOnInit(): void {
    const s = new Structure();
    this.fields = Describer.describe(s).slice(5);
  }

  ngOnChanges() {
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


        default:
          break;
      }
      
    }


  }
  onUpdate(): void {
    this.PHE.getData(this.filter).subscribe(data => {
      this.data = data;
      console.log(data.filter);
      // this.seriesData.series = this.data.data;
      // this.results.push(this.seriesData);
      this.graphData = [];
      this.fields.forEach(field => {
        const thisSeries = new GraphSeries();
        thisSeries.name = field;
        this.data.data.forEach(series => {

          const point = new DataPoint();
          point.value = (series[field] == null) ? '' : series[field];
          point.name = new Date(series.date);
          thisSeries.series.push(point);

        });
        this.graphData.push(thisSeries);

      });

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

    });




  }

}
