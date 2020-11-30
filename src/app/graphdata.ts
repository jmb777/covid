export class DataPoint {
    name: Date;
    value: number;
    }

export class GraphSeries {
    name: string;
    series: DataPoint[];
    
    
    
    constructor(name?: string, series?: DataPoint[]) {
        this.name = name || '';
        this.series = series || [];
    }

}
export class MultilpleGraphSeries extends GraphSeries {
    multiple: GraphSeries[] = [];
}

export class APIData {
    date: Date;
    areaType: string;
    areaName: string;
    areaCode: string;
    series: GraphSeries[];
    constructor() {
        this.areaType = 'nation';
    }
}
