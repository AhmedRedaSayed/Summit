import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomersComponent } from './Components/customers/customers.component';
import { TransactionsComponent } from './Components/transactions/transactions.component';
import { Transaction } from './Interfaces/transaction';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CustomersComponent,TransactionsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(){}
  selectedCustomerId:number | null = null
  transactions:Transaction[] = []


   onCustomerSelected(customerId: number): void {
    this.selectedCustomerId = customerId;
  }

}
