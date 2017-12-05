import { Component, ViewChild, ElementRef } from "@angular/core";

export class Bin {
  items: string[];
  sum: number;
  type: string;

  // This allows you to make the call `new Hero(1, 'Flash')` for example
  constructor() {
    this.items = [];
    this.sum = 0;
  }

  append(item) {
    this.items.push(item);
    this.sum += item.height;
  }
  setType (item) {
    this.type = item.type;
  }
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "Bin Packing";

  fileReaded: any;
  errorLines: any;

  items = [];
  dataLines = [];
  sum = 0;
  aList = [];
  //maxValue = 210;
  binsFin: Bin[] = [];

  @ViewChild('myFile') myFileVariable: any;
  //@ViewChild('containerHeight') containerHeightElement: ElementRef;

  containerHeight: number;
  isPallet: boolean;
  aPallet = {
    "code": "PAL",
    "desc": "Παλέτα",
    "type": "PAL",
    "height": 15,
    "misc": "test"
  };

  ngOnInit() {
    //this.pack(this.aList, this.maxValue);
    this.containerHeight = 210;


    //return (this.binsFin = this.pack(this.aList, this.maxValue));
  }

  pack(values, maxValue) {

    if (Number.isInteger(Number(maxValue))) {
      maxValue = Number(maxValue);
    } else {
      maxValue = 210;
      this.containerHeight = 210;
    }

    let bins: Bin[] = [];
    let isMatched = false;

    // Desc sorting
    values.sort(function(name1, name2) {
      // Mporei na ginei name1.ypsos klp
      if (name1.height > name2.height) {
        return -1;
      } else if (name1.height < name2.height) {
        return 1;
      } else {
        return 0;
      }
    });

    values.forEach(item => {
      let i = 0;
      let len = 0;
      if (bins) {
        len = bins.length;
      }

      let palletSize = 0;
      if (this.isPallet) {
        palletSize = this.aPallet.height;
      }

      for (i = 0; i < len; i++) {
        isMatched = false;
        if (bins[i].sum + item.height + palletSize <= maxValue) {
          if (bins[i].type === item.type) {
            if (this.isPallet) {
              bins[i].append(this.aPallet);
              bins[i].append(item);
            } else {
              bins[i].append(item);
            }
            isMatched = true;
            break;
          }
        }
      }

      if (!isMatched) {
        bins[i] = new Bin();
        bins[i].setType(item);
        bins[i].append(this.aPallet);
        bins[i].append(item);
        //bins.append(bins[i]);
      }
    });

    return bins;
  }

  sumArray(array) {
    if (!array) {
      array = [];
    }
    let sum = 0;
    for (
      let index = 0, length = array.length;
      index < length;
      sum += array[index++]
    ) {}
    return sum;
  }



  csv2Array(fileInput: any) {
    //read file from input
    this.fileReaded = fileInput.target.files[0];
    this.errorLines = [];

    let reader: FileReader = new FileReader();
    reader.readAsText(this.fileReaded);

    reader.onload = e => {
      let csv: string = reader.result;
      let allTextLines = csv.split(/\r|\n|\r/);
      let headers = allTextLines[0].split(';');
      let lines = [];

      for (let i = 1; i < allTextLines.length; i++) {
        // split content based on comma
        let data = allTextLines[i].split(';');
        if (data.length === headers.length) {
          let tarr = [];
          let obj = {};
          for (let j = 0; j < headers.length; j++) {
            if (headers[j] == 'height') {
              obj[headers[j]] = parseFloat(data[j].replace(/,/, '.'));
            } else {
              obj[headers[j]] = data[j];
            }
          }
          tarr.push(obj);

          // log each row to see output
          //console.log(tarr);
          lines.push(obj);
        } else {
          this.errorLines.push(data);
        }
      }
      // all rows in the csv file
      console.log('CSV>>>>>>>>>>>>>>>>>', lines);
      this.dataLines = lines;
      this.calculate();
    };
  }

  calculate() {
    this.binsFin = this.pack(this.dataLines, this.containerHeight);
  }

  clearFile() {

    this.myFileVariable.nativeElement.value = '';
    this.binsFin = [];
    this.dataLines = [];

  }
}