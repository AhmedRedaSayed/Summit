import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Customer } from '../app/Interfaces/customer';
import { Transaction } from '../app/Interfaces/transaction';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private _HttpClient: HttpClient) { }

  getCustomers(): Observable<Customer[]> {
    return this._HttpClient.get<Customer[]>(`https://ahmedredasayed.github.io/jsonFile/customers.json`).pipe(
      catchError(error => {
        console.error('Error fetching customers', error);
        return of([]);
      })
    );
  }

  getTransactions(): Observable<Transaction[]> {
    return this._HttpClient.get<Transaction[]>(`https://ahmedredasayed.github.io/jsonFile/transactions.json`).pipe(
      catchError(error => {
        console.error('Error fetching transactions', error);
        return of([]);
      })
    );
  }

  getTransactionsWithCustomerNames(): Observable<Transaction[]> {
    return this.getCustomers().pipe(
      switchMap(customers => {
        return this.getTransactions().pipe(
          map(transactions => {
            console.log('Transactions:', transactions);
            if (!Array.isArray(transactions)) {
              throw new Error('Transactions response is not an array');
            }
            transactions.forEach(transaction => {
              const customer = customers.find(cust => cust.id == transaction.customer_id);
              if (customer) {
                transaction.customer_name = customer.name;
              }
            });
            return transactions;
          })
        );
      }),
      catchError(error => {
        console.error('Error processing transactions with customer names', error);
        return of([]);
      })
    );
  }
}
