import { Component, Input, OnInit } from '@angular/core';
import { DataPoint, GraphSeries } from '../graphdata';
import { PheService } from '../phe.service';
import { PlaceName } from '../place';
import { Structure } from '../structure';

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
export class GraphComponent implements OnInit {

  @Input() placeName: PlaceName;
  @Input() areaType: string;
  fields: Array<string>;
  selectedOptions: string[] = [];
  multi: GraphSeries[];
  data;
  view: any[] = [700, 300];
  constructor(private PHE: PheService) { }

  ngOnInit(): void {
    const s = new Structure();
    this.fields = Describer.describe(s).slice(5);
  }
  onUpdate(): void {
    this.PHE.getData().subscribe(data => {
      this.data = data;
      console.log(data.filter);
      // this.seriesData.series = this.data.data;
      // this.results.push(this.seriesData);
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
