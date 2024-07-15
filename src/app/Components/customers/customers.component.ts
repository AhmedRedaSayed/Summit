import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Transaction } from '../../Interfaces/transaction';
import { CustomersService } from '../../../Services/customers.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {

  filterName!: string ;
  filterAmount: number | null = null;
  transactionsWithCustomerName!: Transaction[]
  filteredCustomers!:Transaction[]

  constructor(private _customerService:CustomersService){}

  @Output() customerSelected = new EventEmitter<number>();
  ngOnInit(): void {
    this. getCustomer()
  }
  getCustomer()
  {
    this._customerService.getTransactionsWithCustomerNames().subscribe({
      next:(data)=>
      {
        this.transactionsWithCustomerName = data
        this.filteredCustomers = this.transactionsWithCustomerName;
      }
    })
  }


 filterByName()
 {
    this.filteredCustomers = this.transactionsWithCustomerName.filter(transaction => {
      return transaction.customer_name?.toLowerCase().includes(this.filterName?.toLowerCase());
    });
 }
 filterByAmount()
 {
   this.filteredCustomers = this.transactionsWithCustomerName.filter(transaction => {
     return this.filterAmount === null || transaction.amount >= this.filterAmount;
   });
 }

selectedCustomer(customerId:number)
{
  this.customerSelected.emit(customerId)
}


}
