import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Filter } from './filter';
import { APIData, GraphSeries } from './graphdata';
import { Structure } from './structure';


@Injectable({
  providedIn: 'root'
})
export class PheService {

  constructor(private http: HttpClient) { }

  getData(): Observable<GraphSeries[]> {

    const x = new APIData();
    console.log(JSON.stringify(x));
 
    const filter = new Filter();
    filter.areaName = 'cambridge';

    const structure = new Structure();
    structure.date = 'date';
    structure.areaCode = 'areaCode';
    structure.value = 'newCasesByPublishDate';
    structure.name = 'date';
    // structure.cumCasesByPublishDate = 'cumCasesByPublishDate';
    structure.maleCases = 'maleCases';
    
    let endpoint = 'https://api.coronavirus.data.gov.uk/v1/data?';

    endpoint = endpoint + 'filters=areaType=utla;areaCode=E09000012'  + '&structure=' + encodeURI(JSON.stringify(structure));
    console.log(endpoint);


    
    // const uri = encodeURI("/v1/data?filters=areaType=nation;areaName=england&structure={"date":"date","name":"areaName","code":"areaCode","cases":{"daily":"newCasesByPublishDate","cumulative":"cumCasesByPublishDate"},"deaths":{"daily":"newDeathsByDeathDate","cumulative":"cumDeathsByDeathDate"}}");
  // return  this.http.get('https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nation;areaName=england&structure=%7B%22name%22:%22areaName%22%7D');

    return  this.http.get<GraphSeries[]>(endpoint);

  }
}
