import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CustomersService } from '../../../Services/customers.service';
import { Transaction } from '../../Interfaces/transaction';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { Customer } from '../../Interfaces/customer';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CanvasJSAngularChartsModule, CommonModule, NgApexchartsModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnChanges {
  filterTransaction!: Transaction[];
  transactions!: Transaction[];
  customers!: Customer[];
  @Input() customerId!: number;
  chartOptions: any;

  constructor(private _customerService: CustomersService) {}

  ngOnInit(): void {
    this.getCustomers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customerId'] && changes['customerId'].currentValue) {
      this.loadTransactions();
    }
  }

  getCustomers(): void {
    this._customerService.getCustomers()
      .subscribe({
        next: (data: any) => {
          this.customers = data;
        },
        error: (error) => console.error('Error: ', error)
      });
  }

  loadTransactions(): void {
    this._customerService.getTransactions().subscribe({
      next: (data: any) => {
        this.transactions = data;
        this.filterTransaction = this.transactions.filter(transaction => transaction.customer_id === this.customerId);
        this.updateChart();
      },
      error: (error) => console.error('Error: ', error)
    });
  }

  initializeChartOptions(): void {
    this.chartOptions = {
      series: [{
        name: 'Transaction Amount',
        data: []
      }],
      chart: {
        type: 'bar',
        height: 390
      },
      plotOptions: {
        bar: {
          horizontal: false,
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: []
      },
      title: {
        text: 'Transactions Amount per Day'
      }
    };
  }

  updateChart(): void {
    this.initializeChartOptions(); // Ensure chart options are re-initialized
    // Filter transactions by customer ID and update chart data accordingly
    if (this.filterTransaction.length > 0) {
      const transactionsByDate = this.filterTransaction.reduce((acc: { [key: string]: number }, transaction) => {
        const date = transaction.date;
        acc[date] = (acc[date] || 0) + transaction.amount;
        return acc;
      }, {});

      const dates = Object.keys(transactionsByDate);
      const amounts = Object.values(transactionsByDate);


      // Update chart data
      this.chartOptions.series[0].data = amounts;

      // Update x-axis categories with new dates
      this.chartOptions.xaxis.categories = dates;

      // Handle case where only one date is present
      if (dates.length === 1) {
        // Add a dummy second date and amount to display the bar properly
        dates.push(''); // Add an empty string or some dummy value
        amounts.push(0); // Add a zero or some dummy value
      }

      // Apply the changes to the chart
      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          ...this.chartOptions.xaxis,
          categories: dates
        },
        series: [{
          name: 'Transaction Amount',
          data: amounts
        }]
      };

    } else {
      // Handle case where no transactions are found
      this.chartOptions.series[0].data = [];
      this.chartOptions.xaxis.categories = []; // Reset categories
    }
  }
}
