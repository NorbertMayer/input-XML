import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  file: File;
  total: any;
  average: any;
  customer: any;
  orderID: any;
  dateOrder: any;
  constructor(private zone: NgZone) {}
  onChange(event) {

    const eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    const target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    const files: FileList = target.files;
    const file = files[0];

    const reader = new FileReader();

    reader.onload = evt => {
      const {result} = evt.target as any;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(result, 'text/xml');
      // get customer name from the HTML Colection
      const name = xmlDoc.getElementsByTagName('Customer')[0].innerHTML;
      // get order ID
      const getID = xmlDoc.getElementsByTagName('WebOrder')[0].id;
      // get date order
      const getDate = xmlDoc.getElementsByTagName('Date')[0].innerHTML;

      function parseDateStr(theDateToParse) {
        const year = parseInt(getDate.slice(0, 4), 10);
        const month = parseInt(getDate.slice(4, 6), 10);
        const date = parseInt(getDate.slice(-2), 10);

        const d = new Date();

        d.setFullYear(year);
        d.setMonth(month);
        d.setDate(date);

        return d;
      }
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const getOrderDate = parseDateStr(getDate).getDate();
      // get month name
      const getOrderMonth = monthNames[parseDateStr(getDate).getMonth() - 1];
      const getOrderFullyear = parseDateStr(getDate).getFullYear();
      const orderDate = `${getOrderDate} ${getOrderMonth}. ${getOrderFullyear} `;
      // get price and quantity
      const weborder = xmlDoc.getElementsByTagName('Items');
      const prices = weborder[0].getElementsByTagName('Price');
      const pricesAsNums = Array.from(prices).map(price => parseFloat(price.textContent));

      const quantity = weborder[0].getElementsByTagName('Quantity');
      const quantityAsNums = Array.from(quantity).map(qty => parseFloat(qty.textContent));
      // calculate the total based on the quantity and price
      let total = 0;
      for (let i = 0; i < pricesAsNums.length; i++) {
        total += (pricesAsNums[i] * quantityAsNums[i]);
      }
      // get the average
      const sum = pricesAsNums.reduce(function(a, b) {
        return a + b;
      });
      const priceAvg = sum / pricesAsNums.length;
      // pass the prop
      this.zone.run(() => {
        // access the prop
        this.average = priceAvg;
        this.total = total;
        this.customer = name;
        this.orderID = getID;
        this.dateOrder = orderDate;
      });
    };
    reader.readAsText(file);
  }
}
