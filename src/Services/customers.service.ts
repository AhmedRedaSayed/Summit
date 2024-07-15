import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Customer } from '../app/Interfaces/customer';
import { Transaction } from '../app/Interfaces/transaction';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private mainApi = 'http://localhost:3000';
  constructor(private _HttpClient:HttpClient) { }



  getCustomers(): Observable<Customer[]> {
    return this._HttpClient.get<Customer[]>(`${this.mainApi}/customers`);
  }

  getTransactions(): Observable<Transaction[]> {
    return this._HttpClient.get<Transaction[]>(`${this.mainApi}/transactions`);
  }

  getTransactionsWithCustomerNames(): Observable<Transaction[]> {
    return this.getCustomers().pipe(
      switchMap(customers => {
        return this.getTransactions().pipe(
          map(transactions => {
            transactions.forEach(transaction => {
              const customer = customers.find(cust => cust.id == transaction.customer_id);
              if (customer) {
                transaction.customer_name = customer.name;
              }
            });
            return transactions;
          })
        );
      })
    );
  }
}
